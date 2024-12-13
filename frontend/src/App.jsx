import './App.css';

import React from "react";
import { Link } from "react-router-dom";

const App = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Witam w Bibliotece!</h1>
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
