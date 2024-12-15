import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPanel = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    published_year: "",
    genre: "",
    available_copies: 1,
  });
  const [editingBook, setEditingBook] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, [page]);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/book/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          per_page: 10,
        },
      });
      setBooks(response.data.books);
      setTotalPages(response.data.pages);
    } catch (err) {
      setError("Nie udało się pobrać listy książek.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleInputChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditingBook({
      ...editingBook,
      [e.target.name]: e.target.value,
    });
  };

  const addBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/book/add", newBook, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("Książka dodana pomyślnie.");
      setTimeout(() => setSuccess(""), 3000);
      fetchBooks();
      setNewBook({
        title: "",
        author: "",
        published_year: "",
        genre: "",
        available_copies: 1,
      });
    } catch (err) {
      setError("Nie udało się dodać książki.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const deleteBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/book/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("Książka została usunięta.");
      setTimeout(() => setSuccess(""), 3000);
      fetchBooks();
    } catch (err) {
      setError(
        "Nie udało się usunąć książki. Upewnij się, że wszystkie egzemplarze są dostępne."
      );
      setTimeout(() => setError(""), 3000);
    }
  };

  const startEditing = (book) => {
    setEditingBook({
      title: book.title,
      author: book.author,
      published_year: book.published_year,
      genre: book.genre,
      id: book.id,
    });
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/book/${editingBook.id}`,
        {
          title: editingBook.title,
          author: editingBook.author,
          published_year: editingBook.published_year,
          genre: editingBook.genre,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Książka została zaktualizowana.");
      setTimeout(() => setSuccess(""), 3000);
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      setError("Nie udało się zaktualizować książki.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
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

      <h2>Panel Administratora</h2>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Wróć
      </button>

      <form onSubmit={addBook} style={{ marginBottom: "20px" }}>
        <h3>Dodaj nową książkę</h3>
        <input
          type="text"
          name="title"
          placeholder="Tytuł"
          value={newBook.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Autor"
          value={newBook.author}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="published_year"
          placeholder="Rok wydania"
          value={newBook.published_year}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="genre"
          placeholder="Gatunek"
          value={newBook.genre}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="available_copies"
          placeholder="Dostępne egzemplarze"
          value={newBook.available_copies}
          onChange={handleInputChange}
          min="1"
          required
        />
        <button type="submit">Dodaj książkę</button>
      </form>

      <div>
        <h3>Lista książek</h3>
        {books.map((book) => (
          <div
            key={book.id}
            style={{
              margin: "10px 0",
              borderBottom: "1px solid #ccc",
              padding: "10px",
            }}
          >
            {editingBook && editingBook.id === book.id ? (
              <div>
                <input
                  type="text"
                  name="title"
                  value={editingBook.title}
                  onChange={handleEditInputChange}
                />
                <input
                  type="text"
                  name="author"
                  value={editingBook.author}
                  onChange={handleEditInputChange}
                />
                <input
                  type="number"
                  name="published_year"
                  value={editingBook.published_year}
                  onChange={handleEditInputChange}
                />
                <input
                  type="text"
                  name="genre"
                  value={editingBook.genre}
                  onChange={handleEditInputChange}
                />
                <button onClick={saveEdit}>Zapisz</button>
                <button onClick={() => setEditingBook(null)}>Anuluj</button>
              </div>
            ) : (
              <>
                <h4>{book.title}</h4>
                <p>Autor: {book.author}</p>
                <p>Rok wydania: {book.published_year}</p>
                <p>Gatunek: {book.genre}</p>
                <p>Dostępne egzemplarze: {book.available_copies}</p>
                <button onClick={() => startEditing(book)}>Edytuj</button>
                <button onClick={() => deleteBook(book.id)}>Usuń</button>
              </>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Poprzednia strona
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            style={{
              margin: "0 5px",
              backgroundColor: page === index + 1 ? "#ccc" : "transparent",
            }}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Następna strona
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;