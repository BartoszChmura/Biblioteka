import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPanel = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
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
const [editErrors, setEditErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, [page, search]);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/book/all", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          per_page: 10,
          search,
        },
      });
      setBooks(response.data.books);
      setTotalPages(response.data.pages);
    } catch (err) {
      setError("Nie udało się pobrać listy książek");
      setTimeout(() => setError(""), 3000);
    }
  };

  const validateBook = (book) => {
    const newErrors = {};
    if (!book.title || book.title.length > 50) {
      newErrors.title = "Tytuł jest wymagany i nie może przekraczać 50 znaków";
    }
    if (!book.author || book.author.length > 50) {
      newErrors.author = "Autor jest wymagany i nie może przekraczać 50 znaków";
    }
    if (!/^[a-zA-Z\s.,'-]+$/.test(book.author)) {
      newErrors.author = "Autor może zawierać tylko litery, spacje i podstawowe znaki interpunkcyjne";
    }
    const currentYear = new Date().getFullYear();
    if (!book.published_year || isNaN(book.published_year)) {
      newErrors.published_year = "Rok wydania jest wymagany i musi być liczbą.";
    } else if (book.published_year < 1440 || book.published_year > currentYear) {
      newErrors.published_year = `Rok wydania musi być między 1440 a ${currentYear}.`;
    }
    if (!book.genre) {
      newErrors.genre = "Gatunek jest wymagany";
    }
    return newErrors;
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
    setEditErrors({ ...editErrors, [e.target.name]: "" });
  };
  
  const addBook = async (e) => {
    e.preventDefault();
    const newErrors = validateBook(newBook);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/book/add", newBook, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Książka dodana pomyślnie");
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
      setError("Nie udało się dodać książki");
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
      setSuccess("Książka została usunięta");
      setTimeout(() => setSuccess(""), 3000);
      fetchBooks();
    } catch (err) {
      setError("Nie udało się usunąć książki, upewnij się, że wszystkie egzemplarze zostały zwrócone");
      setTimeout(() => setError(""), 3000);
    }
  };

  const saveEdit = async () => {
    const newEditErrors = validateBook(editingBook);
    if (Object.keys(newEditErrors).length > 0) {
      setEditErrors(newEditErrors);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/book/${editingBook.id}`,
        editingBook,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Książka została zaktualizowana");
      setTimeout(() => setSuccess(""), 3000);
      setEditErrors({});
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      setError("Nie udało się zaktualizować książki");
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
        <div>
          <input
            type="text"
            name="title"
            placeholder="Tytuł"
            value={newBook.title}
            onChange={handleInputChange}
          />
          {errors.title && <p style={{ color: "red" }}>{errors.title}</p>}
        </div>
        <div>
          <input
            type="text"
            name="author"
            placeholder="Autor"
            value={newBook.author}
            onChange={handleInputChange}
          />
          {errors.author && <p style={{ color: "red" }}>{errors.author}</p>}
        </div>
        <div>
          <input
            type="number"
            name="published_year"
            placeholder="Rok wydania"
            value={newBook.published_year}
            onChange={handleInputChange}
          />
          {errors.published_year && <p style={{ color: "red" }}>{errors.published_year}</p>}
        </div>
        <div>
          <select name="genre" value={newBook.genre} onChange={handleInputChange}>
            <option value="">Wybierz gatunek</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          {errors.genre && <p style={{ color: "red" }}>{errors.genre}</p>}
        </div>
        <div>
          <input
            type="number"
            name="available_copies"
            placeholder="Dostępne egzemplarze"
            value={newBook.available_copies}
            onChange={handleInputChange}
          />
          {errors.available_copies && (
            <p style={{ color: "red" }}>{errors.available_copies}</p>
          )}
        </div>
        <button type="submit">Dodaj książkę</button>
      </form>

      <div>
  <h3>Lista książek</h3>
  <div style={{ marginBottom: "20px" }}>
    <input
      type="text"
      placeholder="Szukaj po tytule..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{ flex: "1", padding: "8px" }}
    />
  </div>

  {books.map((book) => (
    <div key={book.id} style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
      {editingBook && editingBook.id === book.id ? (
        <div>
          <input
            type="text"
            name="title"
            value={editingBook.title}
            onChange={handleEditInputChange}
          />
          {editErrors.title && <p style={{ color: "red" }}>{editErrors.title}</p>}

          <input
            type="text"
            name="author"
            value={editingBook.author}
            onChange={handleEditInputChange}
          />
          {editErrors.author && <p style={{ color: "red" }}>{editErrors.author}</p>}

          <input
            type="number"
            name="published_year"
            value={editingBook.published_year}
            onChange={handleEditInputChange}
          />
          {editErrors.published_year && (
            <p style={{ color: "red" }}>{editErrors.published_year}</p>
          )}

          <select
            name="genre"
            value={editingBook.genre}
            onChange={handleEditInputChange}
          >
            <option value="">Wybierz gatunek</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          {editErrors.genre && <p style={{ color: "red" }}>{editErrors.genre}</p>}

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
          <button onClick={() => setEditingBook(book)}>Edytuj</button>
          <button onClick={() => deleteBook(book.id)}>Usuń</button>
        </>
      )}
    </div>
  ))}
</div>


      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
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
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
          Następna strona
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
