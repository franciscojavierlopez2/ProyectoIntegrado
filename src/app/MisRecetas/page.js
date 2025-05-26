"use client";

import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../../../components/Navbar.jsx";

const MisRecetas = () => {
  const [recetas, setRecetas] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const ruta = "http://localhost:5000/api";

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          alert("Usuario no autenticado");
          return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user.username);
        const res = await fetch(`${ruta}/receta/usuario/${user.username}`);
        const data = await res.json();
        
        if (res.ok) {
          setRecetas(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecetas();
  }, []);

  const handleDeleteReceta = async (nombre) => {
    try {
      const response = await fetch(`${ruta}/eliminar-receta/${nombre}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setRecetas(recetas.filter(receta => receta.nombre !== nombre));
        setMessage("Receta eliminada");
      } else {
        const data = await response.json();
        setMessage(data.message || "No se pudo eliminar la receta");
      }
    } catch (error) {
      console.error(error);
      setMessage("Hubo un problema al eliminar la receta.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4">Mis Recetas</h2>

        {loading ? (
          <p>Cargando recetas...</p>
        ) : recetas.length === 0 ? (
          <p>No se encontraron recetas</p>
        ) : (
          <div className="row">
            {recetas.map((receta) => (
              <div key={receta.idReceta} className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{receta.nombre}</h5>
                    <p className="card-text">
                      <strong>Pasos: </strong> <br />
                      {receta.pasos.length > 100 ? receta.pasos.slice(0, 100) + "..." : receta.pasos}
                    </p>
                    <p><strong>Dificultad:</strong> {receta.dificultad}</p>
                    <p><strong>Tiempo:</strong> {receta.tiempo_elaboracion}</p>
                    <div className="d-flex justify-content-center mt-3">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteReceta(receta.nombre)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        )}
      </div>
    </>
  );
};

export default MisRecetas;
