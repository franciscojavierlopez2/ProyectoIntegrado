"use client";

import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const segments = window.location.pathname.split("/");
    const urlToken = segments[segments.length - 1];
    if (urlToken) setToken(urlToken);
    else setMessage("No se ha podido acceder al token");
  }, []);

  const handleSubmit = async () => {
    setMessage("");

    if (password !== confirmPassword) {
      setMessage(" Las contraseñas no coinciden");
      return;
    }

    if (!token) {
      setMessage(" Token invalido");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/resetpassword/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setMessage(" Contraseña cambiada");
        setPassword("");
        setConfirmPassword("");
      } else {
        const data = await response.text();
        setMessage(` ${data || "Error al restablecer la contraseña."}`);
      }
    } catch (error) {
      setMessage("Error interno del servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "350px" }}>
        <h3 className="mb-3 text-center">Restablecer contraseña</h3>
        <p className="mb-4 text-center text-muted">
          Ingresa tu nueva contraseña
        </p>

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />

        <button
          className="btn btn-primary w-100"
          disabled={!password || !confirmPassword || loading}
          onClick={handleSubmit}
        >
          {loading ? "Guardando..." : "Cambiar Contraseña"}
        </button>

        {message && (
          <div className="alert alert-info mt-3 text-center" role="alert">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
