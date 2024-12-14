import "./App.css";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRole = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAdmin(false);
        return;
      }

      try {
        const decodedToken = jwt_decode(token);
        setIsAdmin(decodedToken.role === "ADMIN");
      } catch (err) {
        console.error("Błąd podczas dekodowania tokena:", err);
        setIsAdmin(false);
      }
    };

    checkAdminRole();
  }, []);

  const goToAdminPanel = () => {
    if (!isAdmin) {
      setError("Nie masz uprawnień do wejścia w panel administratora.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    navigate("/admin");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Witam w Bibliotece!</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={goToAdminPanel} style={{ margin: "20px" }}>
        Panel Administratora
      </button>
      <p>
        <Link to="/books">Zobacz dostępne książki!</Link>
      </p>
      <p>
        <Link to="/history">Zobacz historię wypożyczeń!</Link>
      </p>
    </div>
  );
};

export default App;
