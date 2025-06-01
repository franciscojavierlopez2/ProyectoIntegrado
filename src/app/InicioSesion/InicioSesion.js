"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const ruta = "http://localhost:5000/api";

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${ruta}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Sesión iniciada");
        console.log("Usuario autenticado:", data);

        localStorage.setItem("user", JSON.stringify(data.usuario));
        localStorage.setItem("role", data.usuario.rol);
        localStorage.setItem('token', data.token);

        router.push("/Inicio");

        setUsername("");
        setPassword("");

      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${ruta}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellidos,
          username,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registro correcto");
        setIsRegister(false);

        setUsername("");
        setPassword("");
        setNombre("");
        setApellidos("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={isRegister ? handleRegister : handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center">
          {isRegister ? "Registrarse" : "Iniciar Sesión"}
        </h2>

        {isRegister && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Apellidos</label>
              <input
                type="text"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Apellidos"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
          />
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
          onClick={() => setIsRegister(!isRegister)}
          className="w-full text-blue-600 hover:underline mt-2 text-sm"
        >
          {isRegister
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </button>
      </form>
    </div >
  );
};

export default Login;
