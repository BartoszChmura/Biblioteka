import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

import Header from "./components/Header";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import History from "./pages/History";
import AdminPanel from "./pages/AdminPanel";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwt_decode(token);
    if (Date.now() >= decoded.exp * 1000) {
      localStorage.removeItem("token");
      return <Navigate to="/login" />;
    }
  } catch (e) {
    console.error("Błąd weryfikacji tokena:", e);
    return <Navigate to="/login" />;
  }

  return children;
};

const RequireAdmin = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwt_decode(token);
    if (Date.now() >= decoded.exp * 1000 || decoded.role !== "ADMIN") {
      localStorage.removeItem("token");
      return <Navigate to="/login" />;
    }
  } catch (e) {
    console.error("Błąd weryfikacji tokena:", e);
    return <Navigate to="/login" />;
  }

  return children;
};

const Routing = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <App />
            </RequireAuth>
          }
        />
        <Route
          path="/books"
          element={
            <RequireAuth>
              <Books />
            </RequireAuth>
          }
        />
        <Route
          path="/history"
          element={
            <RequireAuth>
              <History />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPanel />
            </RequireAdmin>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default Routing;
