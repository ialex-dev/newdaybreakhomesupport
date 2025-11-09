# New Daybreak Home Support - Backend

## Setup Instructions

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Set environment variables (optional):**
   ```bash
   export SECRET_KEY="your-secret-key-here"
   export DATABASE_URL="postgresql://user:password@localhost/daybreak"
   ```

3. **Run the Flask application:**
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`

## Default Admin Credentials

- **Email:** admin@newdaybreakhomesupport.com
- **Password:** admin123

**⚠️ IMPORTANT:** Change the default password immediately in production!

## API Endpoints

### Public Endpoints
- `POST /api/apply` - Submit caregiver application

### Admin Endpoints (require authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify admin token
- `GET /api/admin/applications` - Get all applications
- `GET /api/admin/applications/:id` - Get specific application
- `DELETE /api/admin/applications/:id` - Delete application
- `PATCH /api/admin/applications/:id/status` - Update application status

## Database Models

### Admin
- id (Primary Key)
- name
- email (unique)
- password_hash
- created_at

### CaregiverApplication
- id (Primary Key)
- full_name
- email
- phone
- address
- city_state_zip
- days_hours_available (JSON)
- position_desired
- employment_history (JSON)
- education_level
- certifications (JSON)
- skills_experience
- references (JSON)
- emergency_contact (JSON)
- signature
- status (pending/reviewed)
- submitted_at

## Production Deployment

1. Set strong SECRET_KEY
2. Use PostgreSQL or MySQL instead of SQLite
3. Change default admin password
4. Enable HTTPS
5. Set up proper CORS policies
6. Add rate limiting
7. Add input validation and sanitization