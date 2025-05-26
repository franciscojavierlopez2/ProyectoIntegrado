"use client";

import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar.jsx";

const Perfil = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [edit, setEdit] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const ruta = "http://localhost:5000/api";

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      setError(null);

      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setError("Usuario no autenticado");
        setLoading(false);
        return;
      }

      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user.username) {
          setError("Nombre de usuario no disponible");
          setLoading(false);
          return;
        }

        const res = await fetch(`${ruta}/buscar-user/${user.username}`);
        const data = await res.json();

        if (res.ok) {
          setUserInfo(data.user);
          setNombre(data.user.nombre);
          setApellidos(data.user.apellidos);
          setUsername(data.user.username);
        } else {
          setError(data.message || "No se pudo obtener los datos del usuario");
        }
      } catch (err) {
        console.error(err);
        setError("Ha ocurrido un error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);


  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ruta}/editar-user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userInfo.username,
          nuevoNombre: nombre,
          nuevoApellidos: apellidos,
          nuevoUsername: username,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Usuario actualizado");
        setUserInfo(data.user);
        setEdit(false);
      } else {
        setMessage(data.message || "No se pudo actualizar el usuario");
      }
    } catch (error) {
      console.error(error);
      setMessage("Ha ocurrido un error");
    }
  };




  return (
    <>
      <Navbar />
      <div className="flex justify-center min-h-screen bg-gray-100 pt-30">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Mi Perfil</h2>

          {loading && <p className="text-center">Cargando..</p>}

          {error && <p className="text-red-500 text-center">{error}</p>}

          {userInfo && !edit && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <div className="mt-1 p-2 border rounded bg-gray-50">{userInfo.nombre}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Apellidos</label>
                  <div className="mt-1 p-2 border rounded bg-gray-50">{userInfo.apellidos}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <div className="mt-1 p-2 border rounded bg-gray-50">{userInfo.username}</div>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={() => setEdit(true)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  Editar
                </button>
              </div>
            </>
          )}

          {userInfo && edit && (
            <form onSubmit={handleEdit} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  className="mt-1 p-2 border rounded w-full"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Apellidos</label>
                <input
                  className="mt-1 p-2 border rounded w-full"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  className="mt-1 p-2 border rounded w-full"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex justify-center space-x-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNombre(userInfo.nombre);
                    setApellidos(userInfo.apellidos);
                    setUsername(userInfo.username);
                    setEdit(false);
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {message && <p className="text-center text-green-600 mt-2">{message}</p>}

          {!loading && !userInfo && !error && (
            <p className="text-center">No se encontraron datos del usuario.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Perfil;
