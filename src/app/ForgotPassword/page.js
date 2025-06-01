"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import 'bootstrap/dist/css/bootstrap.min.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const ruta = "http://localhost:5000/api";
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${ruta}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Si tienes un correo asociado te debería llegar un correo");
        router.push("/");
      }
    } catch (error) {
      setMessage(" Error al enviar el correo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "350px" }}>
        <h3 className="mb-3 text-center">Recuperar contraseña</h3>
        <p className="mb-4 text-center text-muted">
          Escribe tu correo para restablecer tu contraseña
        </p>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-primary w-100" disabled={!email}  onClick={handleSubmit}>
          {loading ? "Enviando..." : "Enviar"}
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

export default ForgotPassword;
