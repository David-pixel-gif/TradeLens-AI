from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User
import jwt
import datetime

# Blueprint with URL prefix
authentication_bp = Blueprint("authentication", __name__, url_prefix="/api/auth")

# ✅ Register Endpoint
@authentication_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    
    if not data or not all(k in data for k in ("name", "email", "password")):
        return jsonify({"error": "All fields are required"}), 400

    # Check if email is already taken
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 409

    # Hash password and store user
    hashed_pw = generate_password_hash(data["password"])
    new_user = User(name=data["name"], email=data["email"], password=hashed_pw)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# ✅ Login Endpoint
@authentication_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data or not all(k in data for k in ("email", "password")):
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if user and check_password_hash(user.password, data["password"]):
        token = jwt.encode({
            "user_id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, "secret_key", algorithm="HS256")
        
        return jsonify({"token": token})

    return jsonify({"error": "Invalid credentials"}), 401
