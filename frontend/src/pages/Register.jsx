import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (username.length < 3 || username.length > 20) {
      return "Nazwa użytkownika musi mieć od 3 do 20 znaków";
    }
    if (!usernameRegex.test(username)) {
      return "Nazwa użytkownika może zawierać tylko litery, cyfry, '-' i '_'";
    }
    return null;
  };

  const validatePassword = (password) => {
    if (password.length < 3 || password.length > 20) {
      return "Hasło musi mieć od 3 do 20 znaków.";
    }
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError || passwordError) {
      setError(usernameError || passwordError);
      return;
    }

    try {
      await axios.post("http://localhost:5000/auth/register", {
        username,
        password,
      });
      setSuccess("Rejestracja przebiegła pomyślnie, trwa przekierowywanie...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Nazwa użytkownika już istnieje");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <div style={{ maxWidth: "400px", marginRight: "20px" }}>
        <h2>Rejestracja</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <form onSubmit={handleRegister}>
          <div>
            <input
              type="text"
              placeholder="Nazwa użytkownika"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <p style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
              Nazwa użytkownika musi mieć 3-20 znaków, może zawierać tylko litery, cyfry, "-" oraz "_".
            </p>
          </div>
          <div>
            <input
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
              Hasło musi mieć od 3 do 20 znaków.
            </p>
          </div>
          <button type="submit" style={{ marginTop: "10px" }}>Zarejestruj się</button>
        </form>
        <p style={{ marginTop: "10px" }}>
          Masz już konto? <a href="/login">Logowanie</a>
        </p>
      </div>
      <div style={{ maxWidth: "250px", textAlign: "left", marginTop: "20px", fontSize: "14px" }}>
        <h4>Informacje:</h4>
        <ul>
          <li>Użyj nazwy użytkownika <strong>admin</strong>, aby konto otrzymało uprawnienia administratora.</li>
        </ul>
      </div>
    </div>
  );
};

export default Register;
