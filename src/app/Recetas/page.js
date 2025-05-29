"use client";

import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../../../components/Navbar.jsx";

const Recetas = () => {
    const [recetas, setRecetas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recetasEncontradas, setrecetasEncontradas] = useState('');
    const [listaFavs, setlistaFavs] = useState(false);
    const [favoritasIds, setFavoritasIds] = useState([]);



    const listRecetas = recetas.filter((receta) =>
        receta.nombre.toLowerCase().includes(recetasEncontradas.toLowerCase())
    );

    const ruta = "http://localhost:5000/api";

    useEffect(() => {
        const fetchRecetasYFavoritas = async () => {
            setLoading(true);
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) {
                    alert("Usuario no autenticado");
                    return;
                }

                const user = JSON.parse(storedUser);
                const recetasEndpoint = listaFavs
                    ? `${ruta}/recetas/favoritas/${user.idUser}`
                    : `${ruta}/recetas`;

                const [recetasRes, favoritasRes] = await Promise.all([
                    fetch(recetasEndpoint),
                    fetch(`${ruta}/recetas/favoritas/ids/${user.idUser}`)
                ]);

                const recetasData = await recetasRes.json();
                const favoritasData = await favoritasRes.json();

                if (recetasRes.ok) {
                    setRecetas(recetasData);
                } else {
                    console.error(recetasData.message);
                }

                if (favoritasRes.ok) {
                    setFavoritasIds(favoritasData);
                } else {
                    console.error(favoritasData.message);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecetasYFavoritas();
    }, [listaFavs]);


    const guardarFavorita = async (idReceta) => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return alert("Usuario no autenticado");

        const user = JSON.parse(storedUser);

        try {
            const res = await fetch(`${ruta}/recetas/favoritas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idUser: user.idUser || user.id, idReceta })
            });

            const data = await res.json();
            if (res.ok) {
                if (data.favorita) {
                    setFavoritasIds([...favoritasIds, idReceta]);
                } else {
                    setFavoritasIds(favoritasIds.filter(id => id !== idReceta));
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };



    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <h2 className="mb-4">Recetas</h2>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar recetas"
                        value={recetasEncontradas}
                        onChange={(e) => setrecetasEncontradas(e.target.value)}
                        style={{ width: '200px' }}
                    />
                    <div className="form-check ms-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={listaFavs}
                            onChange={(e) => setlistaFavs(e.target.checked)}
                            id="favoritasCheck"
                        />
                        <label className="form-check-label" htmlFor="favoritasCheck">
                            Favoritas
                        </label>
                    </div>
                </div>


                {loading ? (
                    <p>Cargando recetas...</p>
                ) : listRecetas.length === 0 ? (
                    <p>No hay recetas.</p>
                ) : (
                    <div className="row">
                        {listRecetas.map((receta) => (
                            <div key={receta.idReceta} className="col-md-4 mb-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="card-title">{receta.nombre}</h5>
                                            <span
                                                style={{
                                                    cursor: 'pointer',
                                                    fontSize: '1.5rem',
                                                    color: favoritasIds.includes(receta.idReceta) ? 'gold' : 'gray'
                                                }}
                                                onClick={() => guardarFavorita(receta.idReceta)}
                                            >
                                                ★
                                            </span>
                                        </div>
                                        <p className="card-text">
                                            <strong>Pasos: </strong><br />
                                            {receta.pasos.length > 100 ? receta.pasos.slice(0, 100) + "..." : receta.pasos}
                                        </p>
                                        <p><strong>Dificultad:</strong> {receta.dificultad}</p>
                                        <p><strong>Tiempo:</strong> {receta.tiempo_elaboracion}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div >
        </>

    );
};

export default Recetas;
