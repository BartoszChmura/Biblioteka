from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from app.extensions import db
from app.models.user import User, UserRole
import json
import re

auth_blueprint = Blueprint("auth", __name__)

@auth_blueprint.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or len(username) < 3 or len(username) > 20:
        return jsonify({"error": "Nazwa użytkownika musi mieć od 3 do 20 znaków"}), 400
    if not re.match(r"^[a-zA-Z0-9_-]+$", username):
        return jsonify({"error": "Nazwa użytkownika może zawierać tylko litery, cyfry, '-' i '_'"}), 400

    if not password or len(password) < 3 or len(password) > 20:
        return jsonify({"error": "Hasło musi mieć od 3 do 20 znaków"}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"error": "Użytkownik już istnieje"}), 409

    role = UserRole.ADMIN if username.lower() == "admin" else UserRole.USER

    new_user = User(username=username, role=role)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "Użytkownik został pomyślnie zarejestrowany",
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
        return jsonify({"error": "Nazwa użytkownika i hasło są wymagane"}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Nieprawidłowa nazwa użytkownika lub hasło"}), 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role.name}
    )    

    return jsonify({"access_token": access_token}), 200
