from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from app import db
from app.models.user import User, UserRole
import json

auth_blueprint = Blueprint("auth", __name__)

@auth_blueprint.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    role = UserRole.ADMIN if username.lower() == "admin" else UserRole.USER

    new_user = User(username=username, role=role)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user": {
            "username": new_user.username,
            "role": new_user.role.name
        }
    }), 201


@auth_blueprint.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid username or password"}), 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role.name}
    )    

    return jsonify({"access_token": access_token}), 200