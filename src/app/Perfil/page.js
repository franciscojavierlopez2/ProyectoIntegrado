"use client";

import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar.jsx";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schemaPerfil = yup.object().shape({
  nombre: yup.string().required("Nombre es requerido"),
  apellidos: yup.string().required("Apellidos son requeridos"),
  username: yup.string().required("Usuario es requerido"),
});

const Perfil = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [edit, setEdit] = useState(false);
  const [message, setMessage] = useState("");

  const ruta = "http://localhost:5000/api";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaPerfil),
    defaultValues: {
      nombre: "",
      apellidos: "",
      email: "",
      username: "",
    },
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setError("Usuario no autenticado");
          setLoading(false);
          return;
        }

        if (!user.username) {
          setError("Nombre de usuario no disponible");
          setLoading(false);
          return;
        }

        const res = await fetch(`${ruta}/buscar-user/${user.username}`);
        const data = await res.json();

        if (res.ok) {
          setUserInfo(data.user);
          reset({
            nombre: data.user.nombre,
            apellidos: data.user.apellidos,
            email: data.user.email,
            username: data.user.username,
          });
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

  useEffect(() => {
    if (message === "Usuario actualizado") {
      const tiempo = setTimeout(() => {
        setMessage("");
      }, 2000);

      return () => clearTimeout(tiempo);
    }
  }, [message]);


  const handleEdit = async (data) => {

    try {
      const response = await fetch(`${ruta}/editar-user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userInfo.username,
          nuevoNombre: data.nombre,
          nuevoApellidos: data.apellidos,
          nuevoEmail: data.email,
          nuevoUsername: data.username,
        }),
      });

      const resdata = await response.json();
      if (response.ok) {
        setMessage("Usuario actualizado");
        setUserInfo(resdata.user);
        reset({
          nombre: resdata.user.nombre,
          apellidos: resdata.user.apellidos,
          email: resdata.user.email,
          username: resdata.user.username,
        });
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
      <div className="flex justify-center min-h-screen bg-white-100 pt-20">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md max-h-[450px]">
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
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 p-2 border rounded bg-gray-50">{userInfo.email}</div>
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
            <form onSubmit={handleSubmit(handleEdit)} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  className={`mt-1 p-2 border rounded w-full ${errors.nombre ? "border-red-500" : ""}`}
                  {...register("nombre")}
                />
                {errors.nombre && (
                  <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Apellidos</label>
                <input
                  className={`mt-1 p-2 border rounded w-full ${errors.apellidos ? "border-red-500" : ""}`}
                  {...register("apellidos")}
                />
                {errors.apellidos && (
                  <p className="text-red-600 text-sm mt-1">{errors.apellidos.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className={`mt-1 p-2 border rounded w-full ${errors.email ? "border-red-500" : ""}`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  className={`mt-1 p-2 border rounded w-full ${errors.username ? "border-red-500" : ""}`}
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>
              <div className="flex justify-center gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset({
                      nombre: userInfo.nombre,
                      apellidos: userInfo.apellidos,
                      email: userInfo.email,
                      username: userInfo.username,
                    });
                    setEdit(false);
                    setMessage("");
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