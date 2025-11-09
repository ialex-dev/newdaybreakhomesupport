from functools import wraps
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from flask import jsonify, request

def require_auth(admin_required=True):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
                identity = get_jwt_identity()
                request.user_id = identity['id']
                request.is_admin = identity.get('is_admin', False)
                if admin_required and not request.is_admin:
                    return jsonify({'message': 'Admins only'}), 403
                return fn(*args, **kwargs)
            except Exception as e:
                return jsonify({'message': 'Authentication failed', 'error': str(e)}), 401
        return wrapper
    return decorator
