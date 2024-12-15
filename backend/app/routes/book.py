from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.models.book import Book
from app.utils import admin_required
from app import db

book_blueprint = Blueprint("book", __name__)

@book_blueprint.route("/add", methods=["POST"])
@admin_required
def create_book():
    data = request.get_json()
    title = data.get("title")
    author = data.get("author")
    published_year = data.get("published_year")
    genre = data.get("genre")
    available_copies = data.get("available_copies", 1)

    if not title or not author:
        return jsonify({"error": "Tytuł i autor są wymagane"}), 400

    new_book = Book(
        title=title,
        author=author,
        published_year=published_year,
        genre=genre,
        available_copies=available_copies,
        total_copies=available_copies,
    )
    db.session.add(new_book)
    db.session.commit()

    return jsonify({
        "message": "Książka została pomyślnie utworzona",
        "book": {
            "id": new_book.id,
            "title": new_book.title,
            "author": new_book.author
        }
    }), 201

@book_blueprint.route("/all", methods=["GET"])
@jwt_required()
def get_books():
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 10))

    query = Book.query.filter_by(is_deleted=False).order_by(Book.id.desc())
    paginated_books = query.paginate(page=page, per_page=per_page, error_out=False)

    books = [
        {
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "published_year": book.published_year,
            "genre": book.genre,
            "available_copies": book.available_copies,
        }
        for book in paginated_books.items
    ]

    return jsonify({
        "books": books,
        "total": paginated_books.total,
        "page": paginated_books.page,
        "pages": paginated_books.pages,
    }), 200


@book_blueprint.route("/<int:book_id>", methods=["GET"])
@jwt_required()
def get_book(book_id):
    user_id = get_jwt_identity()
    book = Book.query.filter_by(id=book_id, is_deleted=False).first()
    if not book:
        return jsonify({"error": "Nie znaleziono książki"}), 404

    return jsonify({
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "published_year": book.published_year,
        "genre": book.genre,
        "available_copies": book.available_copies
    }), 200

@book_blueprint.route("/<int:book_id>", methods=["PUT"])
@admin_required
def edit_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Nie znaleziono książki"}), 404

    data = request.get_json()

    book.title = data.get("title", book.title)
    book.author = data.get("author", book.author)
    book.published_year = data.get("published_year", book.published_year)
    book.genre = data.get("genre", book.genre)

    db.session.commit()

    return jsonify({"message": "Książka została pomyślnie zaktualizowana"}), 200


@book_blueprint.route("/<int:book_id>", methods=["DELETE"])
@admin_required
def delete_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Nie znaleziono książki"}), 404

    if book.available_copies != book.total_copies:
        return jsonify({"error": "Nie można usunąć książki. Upewnij się, że wszystkie egzemplarze zostały zwrócone."}), 400

    book.is_deleted = True
    db.session.commit()
    return jsonify({"message": "Książka została oznaczona jako usunięta"}), 200
