import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
        padding: "0px 20px",
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        zIndex: 1000,
        boxSizing: "border-box",
      }}
    >
      <button
        onClick={goToHome}
        style={{
          background: "none",
          border: "none",
          color: "white",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
          padding: "5px 0px",
          textAlign: "left",
          marginLeft: "-10px",
        }}
      >
        Strona Główna
      </button>

      <button
        onClick={handleLogout}
        style={{
          background: "none",
          border: "none",
          color: "red",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
          padding: "5px 0px",
          textAlign: "right",
          marginRight: "-10px",
        }}
      >
        Wyloguj się
      </button>
    </header>
  );
};

export default Header;
