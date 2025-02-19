import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("title");
  const navigate = useNavigate();

  const fetchBooks = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/book/all", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          per_page: 10,
          search,
          sort,
        },
      });
      setBooks(response.data.books);
      setCurrentPage(response.data.page);
      setTotalPages(response.data.pages);
    } catch (err) {
      setError("Nie udało się pobrać listy książek. Zaloguj się ponownie");
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage, search, sort]);

  const borrowBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/loan/borrow/${bookId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
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
      setError(err.response?.data?.error || "Nie udało się wypożyczyć książki");
      setTimeout(() => setError(""), 3000);
    }
  };

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {error && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#ffcccc",
            color: "#cc0000",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#ccffcc",
            color: "#009900",
            padding: "10px 20px",
            borderRadius: "5px",
            zIndex: 1000,
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          {success}
        </div>
      )}

      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Wróć
      </button>

      <h2>Lista Książek</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Szukaj po tytule..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: "1", padding: "8px" }}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="title">Sortuj po tytule A-Z</option>
          <option value="author">Sortuj po autorze A-Z</option>
          <option value="year">Sortuj po roku wydania</option>
        </select>
      </div>

      <div>
        {books.length > 0 ? (
          books.map((book) => (
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
          ))
        ) : (
          <p>Nie znaleziono książek spełniających kryteria.</p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          gap: "10px",
        }}
      >
        <button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Poprzednia
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => changePage(index + 1)}
            style={{
              margin: "0 5px",
              backgroundColor:
                currentPage === index + 1 ? "#ccc" : "transparent",
            }}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Następna
        </button>
      </div>
    </div>
  );
};

export default Books;
