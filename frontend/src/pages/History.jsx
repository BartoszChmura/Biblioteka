import React, { useState, useEffect } from "react";
import axios from "axios";

const History = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState("");

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

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Historia Wypożyczeń</h2>
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
