from flask import Flask
from app.config import config
from flask_cors import CORS
from flask.cli import with_appcontext
from app.models.book import Book
from app.extensions import db, jwt

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

    @app.cli.command("seed_books")
    @with_appcontext
    def seed_books():

        books = [
            {"title": "Władca Pierścieni", "author": "J.R.R. Tolkien", "published_year": 1954, "genre": "Fantasy", "available_copies": 5, "total_copies": 5},
            {"title": "Harry Potter i Kamień Filozoficzny", "author": "J.K. Rowling", "published_year": 1997, "genre": "Fantasy", "available_copies": 10, "total_copies": 10},
            {"title": "Hobbit", "author": "J.R.R. Tolkien", "published_year": 1937, "genre": "Fantasy", "available_copies": 7, "total_copies": 7},
            {"title": "Gra o Tron", "author": "George R.R. Martin", "published_year": 1996, "genre": "Fantasy", "available_copies": 8, "total_copies": 8},
            {"title": "Duma i Uprzedzenie", "author": "Jane Austen", "published_year": 1813, "genre": "Romans", "available_copies": 4, "total_copies": 4},
        ]

        with app.app_context():
            for book in books:
                existing_book = Book.query.filter_by(title=book["title"]).first()
                if not existing_book:
                    new_book = Book(
                        title=book["title"],
                        author=book["author"],
                        published_year=book["published_year"],
                        genre=book["genre"],
                        available_copies=book["available_copies"],
                        total_copies=book["total_copies"]
                    )
                    db.session.add(new_book)
            db.session.commit()
            print("Baza danych została wypełniona przykładowymi książkami!")

    return app
