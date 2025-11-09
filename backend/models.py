from datetime import datetime
from extensions import db, bcrypt

# -----------------------
# User Model (Admin, Employee, Applicant (optional))
# -----------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin' or 'employee' or 'applicant'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Password handling
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)



# -----------------------
# Caregiver Application Model
# -----------------------
class CaregiverApplication(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    # Basic personal & contact info
    full_name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.Text, nullable=False)
    city_state_zip = db.Column(db.String(200), nullable=False)

    # Availability / position
    days_hours_available = db.Column(db.JSON, nullable=True)  # array of strings
    supported_living_availability = db.Column(db.String(500), nullable=True)  # free text or serialized

    position_desired = db.Column(db.String(100), nullable=False)

    # Employment / education / certs
    employment_history = db.Column(db.JSON, nullable=True)
    education_level = db.Column(db.String(100), nullable=True)
    certifications = db.Column(db.JSON, nullable=True)

    # Skills, references, emergency
    skills_experience = db.Column(db.Text, nullable=True)
    references = db.Column(db.JSON, nullable=True)
    emergency_contact = db.Column(db.JSON, nullable=True)

    # Signature, status
    signature = db.Column(db.String(200), nullable=True)
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected

    # Screening booleans (new fields)
    is_over_18 = db.Column(db.Boolean, default=False)
    can_perform_physical_tasks = db.Column(db.Boolean, default=False)
    can_provide_physical_assistance = db.Column(db.Boolean, default=False)
    can_provide_hygiene_assistance = db.Column(db.Boolean, default=False)
    has_drivers_license = db.Column(db.Boolean, default=False)
    has_communication_skills = db.Column(db.Boolean, default=False)
    has_reliable_transport = db.Column(db.Boolean, default=False)

    # timestamps
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        """Return a JSON-serializable dict for this application."""
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'city_state_zip': self.city_state_zip,
            'days_hours_available': self.days_hours_available or [],
            'supported_living_availability': self.supported_living_availability,
            'position_desired': self.position_desired,
            'employment_history': self.employment_history or {},
            'education_level': self.education_level,
            'certifications': self.certifications or [],
            'skills_experience': self.skills_experience,
            'references': self.references or {},
            'emergency_contact': self.emergency_contact or {},
            'signature': self.signature,
            'status': self.status,
            'is_over_18': self.is_over_18,
            'can_perform_physical_tasks': self.can_perform_physical_tasks,
            'can_provide_physical_assistance': self.can_provide_physical_assistance,
            'can_provide_hygiene_assistance': self.can_provide_hygiene_assistance,
            'has_drivers_license': self.has_drivers_license,
            'has_communication_skills': self.has_communication_skills,
            'has_reliable_transport': self.has_reliable_transport,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'reviewed_at': self.reviewed_at.isoformat() if self.reviewed_at else None,
        }