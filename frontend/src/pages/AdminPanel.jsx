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
  const [genres] = useState([
    "Fantastyka",
    "Science Fiction",
    "Romans",
    "Kryminał",
    "Thriller",
    "Horror",
    "Biografia",
    "Historia",
    "Literatura faktu",
    "Powieść",
  ]);
  const [editingBook, setEditingBook] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
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

  const validateBook = () => {
    const newErrors = {};

    if (!newBook.title || newBook.title.length > 50) {
      newErrors.title = "Tytuł jest wymagany i nie może przekraczać 50 znaków.";
    }

    if (!newBook.author || newBook.author.length > 50) {
      newErrors.author = "Autor jest wymagany i nie może przekraczać 50 znaków.";
    }

    if (!/^[a-zA-Z\s.,'-]+$/.test(newBook.author)) {
      newErrors.author = "Autor może zawierać tylko litery, spacje i podstawowe znaki interpunkcyjne.";
    }

    const currentYear = new Date().getFullYear();
    if (!newBook.published_year || isNaN(newBook.published_year)) {
      newErrors.published_year = "Rok wydania jest wymagany i musi być liczbą.";
    } else if (newBook.published_year < 1440 || newBook.published_year > currentYear) {
      newErrors.published_year = `Rok wydania musi być między 1440 a ${currentYear}.`;
    }

    if (!newBook.genre) {
      newErrors.genre = "Gatunek jest wymagany.";
    }

    if (!newBook.available_copies || isNaN(newBook.available_copies)) {
      newErrors.available_copies = "Dostępne egzemplarze są wymagane i muszą być liczbą.";
    } else if (newBook.available_copies < 1 || newBook.available_copies > 100) {
      newErrors.available_copies = "Dostępne egzemplarze muszą być między 1 a 100.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    setNewBook({ ...newBook, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleEditInputChange = (e) => {
    setEditingBook({
      ...editingBook,
      [e.target.name]: e.target.value,
    });
  };

  const addBook = async (e) => {
    e.preventDefault();

    if (!validateBook()) return;

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
    const confirmDelete = window.confirm("Czy na pewno chcesz usunąć tę książkę?");
    if (!confirmDelete) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/book/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Książka została usunięta.");
      setTimeout(() => setSuccess(""), 3000);
      fetchBooks();
    } catch (err) {
      setError("Nie udało się usunąć książki.");
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <h2>Panel Administratora</h2>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ← Wróć
      </button>

      <form onSubmit={addBook} style={{ marginBottom: "20px" }}>
        <h3>Dodaj nową książkę</h3>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Tytuł"
            value={newBook.title}
            onChange={handleInputChange}
            required
          />
          {errors.title && <p style={{ color: "red", fontSize: "12px" }}>{errors.title}</p>}
        </div>
        <div>
          <input
            type="text"
            name="author"
            placeholder="Autor"
            value={newBook.author}
            onChange={handleInputChange}
            required
          />
          {errors.author && <p style={{ color: "red", fontSize: "12px" }}>{errors.author}</p>}
        </div>
        <div>
          <input
            type="number"
            name="published_year"
            placeholder="Rok wydania"
            value={newBook.published_year}
            onChange={handleInputChange}
            required
          />
          {errors.published_year && <p style={{ color: "red", fontSize: "12px" }}>{errors.published_year}</p>}
        </div>
        <div>
          <select
            name="genre"
            value={newBook.genre}
            onChange={handleInputChange}
            required
          >
            <option value="">Wybierz gatunek</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          {errors.genre && <p style={{ color: "red", fontSize: "12px" }}>{errors.genre}</p>}
        </div>
        <div>
          <input
            type="number"
            name="available_copies"
            placeholder="Dostępne egzemplarze"
            value={newBook.available_copies}
            onChange={handleInputChange}
            min="1"
            required
          />
          {errors.available_copies && <p style={{ color: "red", fontSize: "12px" }}>{errors.available_copies}</p>}
        </div>
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
