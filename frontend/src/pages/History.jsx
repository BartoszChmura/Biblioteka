import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [loans, setLoans] = useState([]); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("loan_date_desc");
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/loan/history", {
        headers: { Authorization: `Bearer ${token}` },
        params: { search, sort },
      });
      setLoans(response.data);
    } catch (err) {
      setError("Nie udało się pobrać historii wypożyczeń.");
      setTimeout(() => setError(""), 3000);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [search, sort]);

  const returnBook = async (bookId) => {
    const confirmReturn = window.confirm(
      "Czy na pewno chcesz zwrócić tę książkę?"
    );
    if (!confirmReturn) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/loan/return/${bookId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(response.data.message);
      setTimeout(() => setSuccess(""), 3000);

      setLoans((prevLoans) =>
        prevLoans.map((loan) =>
          loan.book_id === bookId
            ? { ...loan, return_date: new Date().toISOString().split("T")[0] }
            : loan
        )
      );
    } catch (err) {
      setError(err.response?.data?.error || "Nie udało się zwrócić książki.");
      setTimeout(() => setError(""), 3000);
      console.error(err);
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
      <h2>Historia Wypożyczeń</h2>

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
          <option value="loan_date_desc">Sortuj od najnowszych</option>
          <option value="loan_date_asc">Sortuj od najstarszych</option>
        </select>
      </div>

      <div>
        {loans.length > 0 ? (
          loans.map((loan) => (
            <div
              key={loan.book_id}
              style={{
                margin: "10px 0",
                borderBottom: "1px solid #ccc",
                padding: "10px",
              }}
            >
              <h3>{loan.book_title}</h3>
              <p>Data wypożyczenia: {loan.loan_date}</p>
              <p>
                Data zwrotu: {loan.return_date ? loan.return_date : "Nie zwrócono"}
              </p>
              {!loan.return_date && (
                <button onClick={() => returnBook(loan.book_id)}>
                  Zwrot książki
                </button>
              )}
            </div>
          ))
        ) : (
          <p>Brak historii wypożyczeń.</p>
        )}
      </div>
    </div>
  );
};

export default History;
