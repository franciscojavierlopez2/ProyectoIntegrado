"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import 'bootstrap/dist/css/bootstrap.min.css';


const validacionEmail = yup.object().shape({
  email: yup
    .string()
    .email("Correo electrónico inválido")
    .required("Correo obligatorio"),
});

const ForgotPassword = () => {
  const ruta = "http://localhost:5000/api";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validacionEmail) });

  const handleSend = async (data) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${ruta}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const resdata = await response.json();

      if (response.ok) {
        setMessage("Si tienes un correo asociado te debería llegar un correo");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      setMessage(" Error al enviar el correo");
    } finally {
      setLoading(false);
    }
  };

   return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/frutas.jpg')" }}
    >
      <div className="card p-4" style={{ width: "350px" }}>
        <h3 className="mb-3 text-center">Recuperar contraseña</h3>
        <p className="mb-4 text-center text-muted">
          Escribe tu correo para restablecer tu contraseña
        </p>

        <form onSubmit={handleSubmit(handleSend)}>
          <input
            type="email"
            placeholder="Correo electrónico"
            className={`form-control mb-2 ${errors.email ? "is-invalid" : ""}`}
            {...register("email")}
          />
          {errors.email && (
            <div className="invalid-feedback d-block text-center">
              {errors.email.message}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 mt-2"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
          <br></br>

          <div className="text-center">
            <span
               onClick={() => router.push("/")}
              className="text-blue-600 hover:underline cursor-pointer text-lg"
            >
              Volver
            </span>
          </div>

          {message && (
            <div className="alert alert-info mt-3 text-center">{message}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;