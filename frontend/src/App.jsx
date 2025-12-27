import React, { useState, useEffect } from "react";
import Dashboard from "./projet4/Dashboard";
import Login from "./projet4/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un token existe au chargement
    const token = localStorage.getItem('token');

    // Pour les besoins du dev "hors ligne" ou si le token est le placeholder
    if (token) {
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      {isAuthenticated ? <Dashboard /> : <Login />}
    </div>
  );
}

export default App;
