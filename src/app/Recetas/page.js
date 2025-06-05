"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../../../components/Navbar.jsx";

const Recetas = () => {
    const router = useRouter();
    const [recetas, setRecetas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recetasEncontradas, setRecetasEncontradas] = useState('');
    const [listaFavs, setlistaFavs] = useState(false);
    const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
    const [RecetaModal, setRecetaModal] = useState(false);

    const listRecetas = recetas.filter((receta) =>
        receta.nombre.toLowerCase().includes(recetasEncontradas.toLowerCase())
    );

    const ruta = "http://localhost:5000/api";

    const mostrarModal = (receta) => {
        setRecetaSeleccionada(receta);
        setRecetaModal(true);
    };

    const ocultarModal = () => {
        setRecetaModal(false);
        setRecetaSeleccionada(null);
    };

    useEffect(() => {
        const fetchRecetas = async () => {
            setLoading(true);
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) {
                    alert("Usuario no autenticado");
                    router.push("/")
                    return;
                }

                const user = JSON.parse(storedUser);
                const rutaRecetas = listaFavs
                    ? `${ruta}/recetas/favoritas/${user.id}`
                    : `${ruta}/recetas/otros/${user.username}`;


                const recetasRes = await fetch(rutaRecetas);
                const recetasData = await recetasRes.json();

                if (recetasRes.ok) {
                    setRecetas(recetasData);
                } else {
                    console.error(recetasData.message);
                }



            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecetas();
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
                setRecetas(prevRecetas =>
                    prevRecetas.map(receta =>
                        receta.idReceta === idReceta
                            ? { ...receta, favorita: data.favorita ? 1 : 0 }
                            : receta
                    )
                );
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
                        onChange={(e) => setRecetasEncontradas(e.target.value)}
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
                                <div className="card h-100" onClick={() => mostrarModal(receta)} style={{ cursor: 'pointer' }}>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="card-title">{receta.nombre}</h5>
                                            <span
                                                style={{
                                                    cursor: 'pointer',
                                                    fontSize: '1.5rem',
                                                    color: receta.favorita === 1 ? 'gold' : 'gray'

                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    guardarFavorita(receta.idReceta);
                                                }}
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
            {RecetaModal && recetaSeleccionada && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{recetaSeleccionada.nombre}</h5>
                            </div>
                            <div className="modal-body">
                                <p><strong>Pasos:</strong> {recetaSeleccionada.pasos}</p>
                                <p><strong>Dificultad:</strong> {recetaSeleccionada.dificultad}</p>
                                <p><strong>Tiempo de elaboración:</strong> {recetaSeleccionada.tiempo_elaboracion}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark" onClick={ocultarModal}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>


    );
};

export default Recetas;
