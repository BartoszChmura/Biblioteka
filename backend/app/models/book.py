from app import db

class Book(db.Model):
    __tablename__ = "books"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    author = db.Column(db.String(128), nullable=False)
    published_year = db.Column(db.Integer, nullable=True)
    genre = db.Column(db.String(128), nullable=True)
    available_copies = db.Column(db.Integer, default=1, nullable=False)