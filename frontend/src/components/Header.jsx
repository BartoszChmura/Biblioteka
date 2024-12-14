import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Ukrywamy Header na stronach logowania i rejestracji
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0px 20px", // Dodano padding dla lewego i prawego wyrównania
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        zIndex: 1000,
        boxSizing: "border-box",
      }}
    >
      {/* Lewy górny przycisk: Strona Główna */}
      <button
        onClick={goToHome}
        style={{
          background: "none",
          border: "none",
          color: "white",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
          padding: "5px 0px", // Mniejszy padding na osi X
          textAlign: "left", // Wyrównanie tekstu do lewej
          marginLeft: "-10px", // Przesunięcie bardziej w lewo
        }}
      >
        Strona Główna
      </button>

      {/* Prawy górny przycisk: Wyloguj */}
      <button
        onClick={handleLogout}
        style={{
          background: "none",
          border: "none",
          color: "red",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
          padding: "5px 0px", // Mniejszy padding na osi X
          textAlign: "right", // Wyrównanie tekstu do prawej
          marginRight: "-10px", // Przesunięcie bardziej w prawo
        }}
      >
        Wyloguj się
      </button>
    </header>
  );
};

export default Header;
