"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const validacionRegistrar = yup.object().shape({
  nombre: yup.string().required("Nombre obligatorio"),
  apellidos: yup.string().required("Apellidos obligatorio"),
  email: yup.string().email("Email inválido").required("Email obligatorio"),
  username: yup.string().required("Usuario obligatorio"),
  password: yup
    .string()
    .required("Contraseña obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .matches(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
    .matches(/[\W_]/, "La contraseña debe contener al menos un carácter especial"),
});

const validacionLogin = yup.object().shape({
  username: yup.string().required("Usuario obligatorio"),
  password: yup.string().required("Contraseña obligatoria"),
});

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const ruta = "http://localhost:5000/api";
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(isRegister ? validacionRegistrar : validacionLogin),
  });

  const handleLogin = async (data) => {
    try {
      const res = await fetch(`${ruta}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.username, password: data.password }),
      });

      const resdata = await res.json();

      if (res.ok) {
        alert("Sesión iniciada");

        localStorage.setItem("user", JSON.stringify(resdata.usuario));
        localStorage.setItem("role", resdata.usuario.rol);
        localStorage.setItem("token", resdata.token);

        router.push("/Inicio");
        reset();
      } else {
        alert(resdata.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async (data) => {
    try {
      const res = await fetch(`${ruta}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.nombre,
          apellidos: data.apellidos,
          email: data.email,
          username: data.username,
          password: data.password,
        }),
      });

      const resdata = await res.json();

      if (res.ok) {
        alert("Registro correcto");
        setIsRegister(false);
        reset();
      } else {
        alert(resdata.message);
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/frutas.jpg')" }}
    >

      <form
        onSubmit={isRegister ? handleSubmit(handleRegister) : handleSubmit(handleLogin)}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center">
          {isRegister ? "Registrarse" : "Iniciar Sesión"}
        </h2>

        {isRegister && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                {...register("nombre")}
                type="text"
                placeholder="Nombre"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.nombre && (
                <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Apellidos</label>
              <input
                {...register("apellidos")}
                type="text"
                placeholder="Apellidos"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.apellidos && (
                <p className="text-red-600 text-sm mt-1">{errors.apellidos.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Usuario</label>
          <input
            {...register("username")}
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.username && (
            <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {!isRegister && (
          <div className="text-center">
            <span
              onClick={() => router.push("/ForgotPassword")}
              className="text-blue-600 hover:underline cursor-pointer text-sm"
            >
              ¿Olvidaste tu contraseña?
            </span>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {isRegister ? "Registrarse" : "Iniciar Sesión"}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            reset();
          }}
          className="w-full text-blue-600 hover:underline mt-2 text-sm"
        >
          {isRegister
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </button>
      </form>
    </div>
  );
};

export default Login;
