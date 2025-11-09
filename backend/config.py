import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://newdaycarehomesupport_db_user:cbHJQGyTzwCrzDQfbmhilTXKYp6LIaHx@dpg-d48cgaa4d50c738n5d90-a.frankfurt-postgres.render.com/newdaycarehomesupport_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = SECRET_KEY
