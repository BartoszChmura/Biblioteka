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
            {"title": "Lśnienie", "author": "Stephen King", "published_year": 1977, "genre": "Horror", "available_copies": 5, "total_copies": 5},
            {"title": "Duma i Uprzedzenie", "author": "Jane Austen", "published_year": 1813, "genre": "Romans", "available_copies": 4, "total_copies": 4},
            {"title": "Diuna", "author": "Frank Herbert", "published_year": 1965, "genre": "Science Fiction", "available_copies": 5, "total_copies": 5},
            {"title": "Sherlock Holmes: Studium w Szkarłacie", "author": "Arthur Conan Doyle", "published_year": 1887, "genre": "Kryminał", "available_copies": 5, "total_copies": 5},
            {"title": "Zaginiona Dziewczyna", "author": "Gillian Flynn", "published_year": 2012, "genre": "Thriller", "available_copies": 5, "total_copies": 5},
            {"title": "To", "author": "Stephen King", "published_year": 1986, "genre": "Horror", "available_copies": 3, "total_copies": 3},
            {"title": "Romeo i Julia", "author": "William Shakespeare", "published_year": 1597, "genre": "Romans", "available_copies": 5, "total_copies": 5},
            {"title": "Neuromancer", "author": "William Gibson", "published_year": 1984, "genre": "Science Fiction", "available_copies": 4, "total_copies": 4},
            {"title": "Frankenstein", "author": "Mary Shelley", "published_year": 1818, "genre": "Horror", "available_copies": 6, "total_copies": 6},
            {"title": "Gra o Tron", "author": "George R.R. Martin", "published_year": 1996, "genre": "Fantasy", "available_copies": 8, "total_copies": 8},
            {"title": "Kod Leonarda da Vinci", "author": "Dan Brown", "published_year": 2003, "genre": "Thriller", "available_copies": 7, "total_copies": 7},
            {"title": "Jane Eyre", "author": "Charlotte Bronte", "published_year": 1847, "genre": "Romans", "available_copies": 4, "total_copies": 4},
            {"title": "Koniec Wieczności", "author": "Isaac Asimov", "published_year": 1955, "genre": "Science Fiction", "available_copies": 7, "total_copies": 7},
            {"title": "Cmentarz dla Zwierząt", "author": "Stephen King", "published_year": 1983, "genre": "Horror", "available_copies": 4, "total_copies": 4},
            {"title": "Eragon", "author": "Christopher Paolini", "published_year": 2002, "genre": "Fantasy", "available_copies": 6, "total_copies": 6},
            {"title": "Morderstwo w Orient Expressie", "author": "Agatha Christie", "published_year": 1934, "genre": "Kryminał", "available_copies": 6, "total_copies": 6},
            {"title": "Wichrowe Wzgórza", "author": "Emily Bronte", "published_year": 1847, "genre": "Romans", "available_copies": 3, "total_copies": 3},
            {"title": "Złodziej Pioruna", "author": "Rick Riordan", "published_year": 2005, "genre": "Fantasy", "available_copies": 8, "total_copies": 8},
            {"title": "Milczenie Owiec", "author": "Thomas Harris", "published_year": 1988, "genre": "Thriller", "available_copies": 4, "total_copies": 4},
            {"title": "Dracula", "author": "Bram Stoker", "published_year": 1897, "genre": "Horror", "available_copies": 4, "total_copies": 4},
            {"title": "Fundacja", "author": "Isaac Asimov", "published_year": 1951, "genre": "Science Fiction", "available_copies": 6, "total_copies": 6},
            {"title": "Dziesięciu Murzynków", "author": "Agatha Christie", "published_year": 1939, "genre": "Kryminał", "available_copies": 6, "total_copies": 6},
            {"title": "Inferno", "author": "Dan Brown", "published_year": 2013, "genre": "Thriller", "available_copies": 6, "total_copies": 6},
            {"title": "Hobbit", "author": "J.R.R. Tolkien", "published_year": 1937, "genre": "Fantasy", "available_copies": 7, "total_copies": 7},
            {"title": "Ania z Zielonego Wzgórza", "author": "Lucy Maud Montgomery", "published_year": 1908, "genre": "Romans", "available_copies": 7, "total_copies": 7},
            {"title": "Czerwony Smok", "author": "Thomas Harris", "published_year": 1981, "genre": "Thriller", "available_copies": 4, "total_copies": 4},
            {"title": "Rok 1984", "author": "George Orwell", "published_year": 1949, "genre": "Science Fiction", "available_copies": 3, "total_copies": 3},
            {"title": "Zabójstwo Rogera Ackroyda", "author": "Agatha Christie", "published_year": 1926, "genre": "Kryminał", "available_copies": 4, "total_copies": 4},
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
