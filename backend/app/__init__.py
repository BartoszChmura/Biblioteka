from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from app.config import config
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = config.SECRET_KEY
    app.config["SQLALCHEMY_DATABASE_URI"] = config.SQLALCHEMY_DATABASE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = config.JWT_SECRET_KEY

    CORS(app)

    db.init_app(app)
    jwt.init_app(app)

    from app.routes.auth import auth_blueprint
    from app.routes.book import book_blueprint
    from app.routes.loan import loan_blueprint
    app.register_blueprint(auth_blueprint, url_prefix="/auth")
    app.register_blueprint(book_blueprint, url_prefix="/book")
    app.register_blueprint(loan_blueprint, url_prefix="/loan")

    return app
