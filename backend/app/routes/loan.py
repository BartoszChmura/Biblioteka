from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.book import Book
from app.models.loan import Loan
from datetime import datetime
from app import db

loan_blueprint = Blueprint("loan", __name__)

@loan_blueprint.route("/borrow/<int:book_id>", methods=["POST"])
@jwt_required()
def borrow_book(book_id):
    user_id = get_jwt_identity()

    book = Book.query.get(book_id)
    if not book:
        return jsonify({"error": "Nie znaleziono książki"}), 404

    if book.available_copies < 1:
        return jsonify({"error": "Brak dostępnych egzemplarzy"}), 400

    existing_loan = Loan.query.filter_by(user_id=user_id, book_id=book_id, return_date=None).first()
    if existing_loan:
        return jsonify({"error": "Już wypożyczyłeś tę książkę"}), 400

    book.available_copies -= 1

    new_loan = Loan(user_id=user_id, book_id=book_id)
    db.session.add(new_loan)
    db.session.commit()

    return jsonify({"message": "Książka została pomyślnie wypożyczona"}), 200

@loan_blueprint.route("/return/<int:book_id>", methods=["POST"])
@jwt_required()
def return_book(book_id):
    user_id = get_jwt_identity()

    loan = Loan.query.filter_by(user_id=user_id, book_id=book_id, return_date=None).first()
    if not loan:
        return jsonify({"error": "Nie znaleziono aktywnego wypożyczenia dla tej książki"}), 404

    loan.return_date = datetime.utcnow()

    book = Book.query.get(book_id)
    book.available_copies += 1

    db.session.commit()

    return jsonify({"message": "Książka została pomyślnie zwrócona"}), 200

@loan_blueprint.route("/history", methods=["GET"])
@jwt_required()
def loan_history():
    user_id = get_jwt_identity()

    search = request.args.get("search", "")
    sort = request.args.get("sort", "loan_date_desc")

    query = Loan.query.filter_by(user_id=user_id)

    if search:
        query = query.join(Book).filter(Book.title.ilike(f"%{search}%"))

    if sort == "loan_date_asc":
        query = query.order_by(Loan.loan_date.asc())
    else:
        query = query.order_by(Loan.loan_date.desc())

    loans = query.all()

    return jsonify([
        {
            "book_id": loan.book_id,
            "book_title": loan.book.title,
            "loan_date": loan.loan_date.strftime("%Y-%m-%d"),
            "return_date": loan.return_date.strftime("%Y-%m-%d") if loan.return_date else None
        }
        for loan in loans
    ]), 200
