from flask import Flask, request, jsonify, render_template_string, send_file
try:
    from weasyprint import HTML, CSS
    WEASYPRINT_AVAILABLE = True
except Exception:
    WEASYPRINT_AVAILABLE = False
from io import BytesIO
from datetime import datetime
import json

from extensions import db, migrate, bcrypt, jwt, cors
from models import User, CaregiverApplication
from config import Config
from flask_jwt_extended import (create_access_token, jwt_required, get_jwt_identity )

# -----------------------------------------------------------------------------
# App Initialization
# -----------------------------------------------------------------------------
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
migrate.init_app(app, db)
bcrypt.init_app(app)
jwt.init_app(app)
cors.init_app(app)


# -----------------------------------------------------------------------------
# Helper: Placeholder Email Function
# -----------------------------------------------------------------------------
def send_email(to_address: str, subject: str, body: str):
    """Simple debug email sender (replace with Flask-Mail, SendGrid, etc.)"""
    print(f"=== EMAIL DEBUG ===\nTo: {to_address}\nSubject: {subject}\n\n{body}\n")


# -----------------------------------------------------------------------------
# Helper: Extract current identity
# -----------------------------------------------------------------------------
def current_identity():
    """
    Returns tuple (user_id, role) from JWT identity payload.
    The token stores: {'id': user.id, 'role': user.role}
    """
    identity = get_jwt_identity()
    if isinstance(identity, dict):
        return identity.get('id'), identity.get('role')
    # fallback for legacy tokens that stored plain id
    return identity, None


# -----------------------------------------------------------------------------
# Authentication: Login
# -----------------------------------------------------------------------------
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid credentials'}), 401

    # JWT token with user identity
    token = create_access_token(identity={'id': user.id, 'role': user.role})

    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role
        }
    }), 200
    
    # -----------------------------------------------------------------------------
# Get Current User
# -----------------------------------------------------------------------------
@app.route('/api/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id, _ = current_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'role': user.role,
        'created_at': user.created_at.isoformat() if user.created_at else None
    }), 200


# -----------------------------------------------------------------------------
# Caregiver: Submit Application
# -----------------------------------------------------------------------------
@app.route('/api/apply', methods=['POST'])
def submit_application():
    data = request.get_json() or {}
    # Basic required fields validation (adjust as desired)
    required = ['full_name', 'email', 'phone', 'address', 'city_state_zip', 'position_desired', 'signature']
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({'message': 'Missing required fields', 'missing': missing}), 400

    # Normalize boolean screening values: accept true/false or "true"/"false" or "yes"/"no"
    def to_bool(x):
        if isinstance(x, bool): return x
        if x is None: return False
        s = str(x).strip().lower()
        return s in ('1', 'true', 'yes', 'y', 'on')

    try:
        application = CaregiverApplication(
            full_name = data.get('full_name'),
            email = data.get('email'),
            phone = data.get('phone'),
            address = data.get('address'),
            city_state_zip = data.get('city_state_zip'),
            days_hours_available = data.get('days_hours_available') or [],
            position_desired = data.get('position_desired'),
            employment_history = data.get('employment_history') or {},
            education_level = data.get('education_level'),
            certifications = data.get('certifications') or [],
            skills_experience = data.get('skills_experience'),
            references = data.get('references') or {},
            emergency_contact = data.get('emergency_contact') or {},
            signature = data.get('signature'),

            # screening booleans
            is_over_18 = to_bool(data.get('is_over_18')),
            can_perform_physical_tasks = to_bool(data.get('can_perform_physical_tasks')),
            can_provide_physical_assistance = to_bool(data.get('can_provide_physical_assistance')),
            can_provide_hygiene_assistance = to_bool(data.get('can_provide_hygiene_assistance')),
            has_drivers_license = to_bool(data.get('has_drivers_license')),
            has_communication_skills = to_bool(data.get('has_communication_skills')),
            has_reliable_transport = to_bool(data.get('has_reliable_transport')),
            supported_living_availability = data.get('supported_living_availability'),
        )

        db.session.add(application)
        db.session.commit()

        return jsonify({
            'message': 'Application submitted successfully',
            'application_id': application.id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error submitting application', 'error': str(e)}), 500


# -----------------------------------------------------------------------------
# Admin: List All Applications
# -----------------------------------------------------------------------------
@app.route('/api/admin/applications', methods=['GET'])
@jwt_required()
def get_applications():
    user_id, role = current_identity()
    if role != 'admin':
        return jsonify({'message': 'Admin privileges required'}), 403

    applications = CaregiverApplication.query.order_by(
        CaregiverApplication.submitted_at.desc()
    ).all()

    result = []
    for app_rec in applications:
        result.append({
            'id': app_rec.id,
            'full_name': app_rec.full_name,
            'email': app_rec.email,
            'phone': app_rec.phone,
            'position_desired': app_rec.position_desired,
            'status': app_rec.status,
            'submitted_at': app_rec.submitted_at.isoformat() if app_rec.submitted_at else None,
            'reviewed_at': app_rec.reviewed_at.isoformat() if app_rec.reviewed_at else None,
            # optional small screening summary for admin list
            'screening': {
                'is_over_18': app_rec.is_over_18,
                'has_drivers_license': app_rec.has_drivers_license,
                'has_reliable_transport': app_rec.has_reliable_transport
            }
        })

    return jsonify(result), 200


# -----------------------------------------------------------------------------
# Admin: Approve / Reject Application
# -----------------------------------------------------------------------------
@app.route('/api/admin/applications/<int:application_id>/status', methods=['POST'])
@jwt_required()
def update_application_status(application_id):
    _, role = current_identity()
    if role != 'admin':
        return jsonify({'message': 'Admin privileges required'}), 403

    data = request.get_json() or {}
    new_status = data.get('status')
    note = data.get('note', '')

    if new_status not in ('approved', 'rejected'):
        return jsonify({'message': "Status must be 'approved' or 'rejected'"}), 400

    app_rec = CaregiverApplication.query.get(application_id)
    if not app_rec:
        return jsonify({'message': 'Application not found'}), 404

    app_rec.status = new_status
    app_rec.reviewed_at = datetime.utcnow()
    db.session.commit()

    # Notify applicant
    if new_status == 'approved':
        subject = "Application Approved - New Daybreak Home Support"
        body = (
            f"Dear {app_rec.full_name},\n\n"
            f"Congratulations! Your application for {app_rec.position_desired} "
            f"has been approved. {note}\n\nWe will be in touch with next steps."
        )
    else:
        subject = "Application Update - New Daybreak Home Support"
        body = (
            f"Dear {app_rec.full_name},\n\n"
            f"Thank you for applying for {app_rec.position_desired}. "
            f"Unfortunately, your application was not successful. {note}\n\nBest wishes."
        )

    send_email(app_rec.email, subject, body)

    return jsonify({'message': f'Application {new_status} and applicant notified.'}), 200


# -----------------------------------------------------------------------------
# Utility: Create default admin on first run
# -----------------------------------------------------------------------------
def create_tables():
    with app.app_context():
        db.create_all()

        if not User.query.filter_by(role='admin').first():
            default_admin = User(
                name='Admin',
                email='admin@newdaybreakhomesupport.com',
                role='admin'
            )
            default_admin.set_password('admin123')
            db.session.add(default_admin)
            db.session.commit()
            print("✅ Default admin created: admin@newdaybreakhomesupport.com / admin123")

# Run setup when starting app
create_tables()

# -----------------------------------------------------------------------------
# Admin: Download Application (JSON or PDF)
# -----------------------------------------------------------------------------
@app.route('/api/admin/applications/<int:application_id>/download', methods=['GET'])
@jwt_required()
def download_application(application_id):
    user_id, role = current_identity()
    if role != 'admin':
        return jsonify({'message': 'Admin privileges required'}), 403

    app_rec = CaregiverApplication.query.get(application_id)
    if not app_rec:
        return jsonify({'message': 'Application not found'}), 404

    payload = app_rec.to_dict()

    out_format = (request.args.get('format') or 'json').lower()

    # JSON download (default)
    if out_format == 'json' or not WEASYPRINT_AVAILABLE:
        bio = BytesIO(json.dumps(payload, indent=2).encode('utf-8'))
        bio.seek(0)
        return send_file(
            bio,
            mimetype='application/json',
            as_attachment=True,
            download_name=f'application_{application_id}.json'
        )

    # PDF download (WeasyPrint required)
    if out_format == 'pdf':
        if not WEASYPRINT_AVAILABLE:
            return jsonify({'message': 'PDF export not available (WeasyPrint not installed on server)'}), 501

        # # Minimal HTML template - you can expand styling to match Download.tsx
        # html_template = """
        # <!doctype html>
        # <html>
        # <head>
        #   <meta charset="utf-8" />
        #   <style>
        #     body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; color: #111827; }
        #     .container { max-width: 800px; margin: 20px auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; }
        #     h1 { color: #b45309; } /* amber-600 */
        #     h2 { color: #374151; margin-top: 12px; }
        #     .section { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb; }
        #     .meta { font-size: 0.95rem; color: #4b5563; }
        #     .badge { display:inline-block;padding:4px 8px;border-radius:6px;color:#fff;font-size:0.8rem; }
        #     .badge.pending { background:#d97706; } /* yellow-600 */
        #     .badge.approved { background:#16a34a; } /* green-600 */
        #     .badge.rejected { background:#dc2626; } /* red-600 */
        #     .kv { margin:4px 0; }
        #     .kv strong { display:inline-block; width:160px; }
        #     pre { white-space: pre-wrap; font-family:inherit; }
        #   </style>
        # </head>
        # <body>
        #   <div class="container">
        #     <h1>Caregiver Application</h1>
        #     <p class="meta">Submitted: {{ submitted_at }} | ID: {{ id }}</p>

        #     <div class="section">
        #       <h2>Personal Information</h2>
        #       <div class="kv"><strong>Full Name:</strong> {{ full_name }}</div>
        #       <div class="kv"><strong>Email:</strong> {{ email }}</div>
        #       <div class="kv"><strong>Phone:</strong> {{ phone }}</div>
        #       <div class="kv"><strong>Address:</strong> {{ address }}</div>
        #       <div class="kv"><strong>City/State/ZIP:</strong> {{ city_state_zip }}</div>
        #       <div class="kv"><strong>Position Desired:</strong> {{ position_desired }}</div>
        #       <div class="kv"><strong>Availability:</strong> {{ days_hours_available }}</div>
        #     </div>

        #     <div class="section">
        #       <h2>Employment History</h2>
        #       {% if employment_history %}
        #         {% for k,v in employment_history.items() %}
        #           <div class="kv"><strong>{{ k }} - Employer:</strong> {{ v.name or '' }}</div>
        #           <div class="kv"><strong>{{ k }} - Position:</strong> {{ v.position or '' }}</div>
        #           <div class="kv"><strong>{{ k }} - Duration:</strong> {{ v.duration or '' }}</div>
        #           <div class="kv"><strong>{{ k }} - Reason for leaving:</strong> {{ v.reason_for_leaving or '' }}</div>
        #         {% endfor %}
        #       {% else %}
        #         <div class="kv">No employment history provided.</div>
        #       {% endif %}
        #     </div>

        #     <div class="section">
        #       <h2>Education & Certifications</h2>
        #       <div class="kv"><strong>Education Level:</strong> {{ education_level or '-' }}</div>
        #       <div class="kv"><strong>Certifications:</strong> {{ certifications | join(', ') }}</div>
        #     </div>

        #     <div class="section">
        #       <h2>Skills & Experience</h2>
        #       <pre>{{ skills_experience or '-' }}</pre>
        #     </div>

        #     <div class="section">
        #       <h2>References</h2>
        #       {% for k,v in references.items() %}
        #         <div class="kv"><strong>{{ k }}:</strong> {{ v.name }} — {{ v.phone }} ({{ v.relationship }})</div>
        #       {% endfor %}
        #     </div>

        #     <div class="section">
        #       <h2>Emergency Contact</h2>
        #       <div class="kv"><strong>Name:</strong> {{ emergency_contact.name or '-' }}</div>
        #       <div class="kv"><strong>Phone:</strong> {{ emergency_contact.phone or '-' }}</div>
        #       <div class="kv"><strong>Relationship:</strong> {{ emergency_contact.relationship or '-' }}</div>
        #     </div>

        #     <div class="section">
        #       <h2>Screening / Eligibility</h2>
        #       <div class="kv"><strong>18+:</strong> {{ is_over_18 }}</div>
        #       <div class="kv"><strong>Can do physical tasks:</strong> {{ can_perform_physical_tasks }}</div>
        #       <div class="kv"><strong>Can provide physical assistance:</strong> {{ can_provide_physical_assistance }}</div>
        #       <div class="kv"><strong>Can provide hygiene assistance:</strong> {{ can_provide_hygiene_assistance }}</div>
        #       <div class="kv"><strong>Driver's license:</strong> {{ has_drivers_license }}</div>
        #       <div class="kv"><strong>Reliable transport:</strong> {{ has_reliable_transport }}</div>
        #       <div class="kv"><strong>Supported living availability:</strong> {{ supported_living_availability or '-' }}</div>
        #     </div>

        #     <div class="section">
        #       <h2>Signature & Status</h2>
        #       <div class="kv"><strong>Signature:</strong> {{ signature }}</div>
        #       <div class="kv"><strong>Status:</strong> <span class="badge {{ status }}">{{ status }}</span></div>
        #       <div class="kv"><strong>Reviewed at:</strong> {{ reviewed_at or '-' }}</div>
        #     </div>
        #   </div>
        # </body>
        # </html>
        # """

        # html = render_template_string(html_template, **payload)
        # pdf_bytes = HTML(string=html).write_pdf(stylesheets=[CSS(string='@page { size: A4; margin: 20mm }')])
        # bio = BytesIO(pdf_bytes)
        # bio.seek(0)
        return send_file(
            bio,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'application_{application_id}.pdf'
        )

    return jsonify({'message': 'Unsupported format'}), 400


# -----------------------------------------------------------------------------
# Entry Point
# -----------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True, port=5000)
