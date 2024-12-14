import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/loan/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLoans(response.data);
      } catch (err) {
        setError("Nie udało się pobrać historii wypożyczeń.");
        console.error(err);
      }
    };

    fetchHistory();
  }, []);

  const returnBook = async (bookId) => {
    const confirmReturn = window.confirm(
      "Czy na pewno chcesz zwrócić tę książkę?"
    );

    if (!confirmReturn) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/loan/return/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      console.error(err);
      setError(
        err.response?.data?.error || "Nie udało się zwrócić książki."
      );
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
      <h2>Historia Wypożyczeń</h2>
      {success && (
        <p style={{ color: "green", textAlign: "center" }}>{success}</p>
      )}
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
