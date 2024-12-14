import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/book/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooks(response.data);
      } catch (err) {
        setError("Nie udało się pobrać listy książek. Zaloguj się ponownie.");
        console.error(err);
      }
    };

    fetchBooks();
  }, []);

  const borrowBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/loan/borrow/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(response.data.message);
      setTimeout(() => setSuccess(""), 3000);
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === bookId
            ? { ...book, available_copies: book.available_copies - 1 }
            : book
        )
      );
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error === "You have already borrowed this book") {
        setError("Już wypożyczyłeś tę książkę.");
      } else {
        setError(
          err.response?.data?.error || "Nie udało się wypożyczyć książki."
        );
      }
      setTimeout(() => setError(""), 3000);
    }
  };

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Wróć
      </button>
      <h2>Lista Książek</h2>
      {success && (
        <p style={{ color: "green", textAlign: "center" }}>{success}</p>
      )}
      <div>
        {books.map((book) => (
          <div
            key={book.id}
            style={{
              margin: "10px 0",
              borderBottom: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <h3>{book.title}</h3>
            <p>Autor: {book.author}</p>
            <p>Rok wydania: {book.published_year}</p>
            <p>Gatunek: {book.genre}</p>
            <p>Dostępne egzemplarze: {book.available_copies}</p>
            <button
              onClick={() => borrowBook(book.id)}
              disabled={book.available_copies < 1}
            >
              {book.available_copies > 0 ? "Wypożycz" : "Brak egzemplarzy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
