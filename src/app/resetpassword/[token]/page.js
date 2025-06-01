"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import 'bootstrap/dist/css/bootstrap.min.css';

const validacionPassword = yup.object().shape({
  password: yup
    .string()
    .required("Contraseña obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .matches(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
    .matches(/[\W_]/, "La contraseña debe contener al menos un carácter especial"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
    .required("Reescribe la contraseña para comprobarla"),
});

const ResetPassword = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validacionPassword),
  });

  useEffect(() => {
    const segments = window.location.pathname.split("/");
    const urlToken = segments[segments.length - 1];
    if (urlToken) setToken(urlToken);
    else setMessage("No se ha podido acceder al token");
  }, []);

  const handleRestablecer = async (data) => {
    setMessage("");

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
        body: JSON.stringify({ password: data.password }),
      });

      if (response.ok) {
        setMessage(" Contraseña cambiada");
        reset();
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        const resdata = await response.text();
        setMessage(` ${data}`);
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
        <p className="mb-4 text-center text-muted">Ingresa tu nueva contraseña</p>

        <form onSubmit={handleSubmit(handleRestablecer)}>
          <input
            type="password"
            className={`form-control mb-2 ${errors.password ? "is-invalid" : ""}`}
            placeholder="Nueva contraseña"
            {...register("password")}
            disabled={loading}
          />
          {errors.password && (
            <div className="invalid-feedback d-block">{errors.password.message}</div>
          )}

          <input
            type="password"
            className={`form-control mb-2 ${errors.confirmPassword ? "is-invalid" : ""}`}
            placeholder="Confirmar contraseña"
            {...register("confirmPassword")}
            disabled={loading}
          />
          {errors.confirmPassword && (
            <div className="invalid-feedback d-block">{errors.confirmPassword.message}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Cambiar Contraseña"}
          </button>
        </form>

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