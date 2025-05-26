import { useState } from "react";

const ProSuper = () => {
    const [vista, setVista] = useState(null);
    const [nombreProducto, setNombreProducto] = useState("");
    const [nombreSuper, setNombreSuper] = useState("");
    const [precio, setPrecio] = useState("");
    const [valoracion, setValoracion] = useState("");
    const [message, setMessage] = useState("");
    const ruta = "http://localhost:5000/api";

    const toggleVista = (nuevaVista) => {
        setMessage("");
        setVista(vista === nuevaVista ? null : nuevaVista);
        setNombreProducto("");
        setNombreSuper("");
        setPrecio("");
        setValoracion("");
    };

    const checkProductExists = async (nombre) => {
        try {
            const response = await fetch(`${ruta}/buscar-producto/${nombre}`);
            const data = await response.json();
            return response.ok && data.producto !== null;
        } catch (error) {
            console.error(error);
            setMessage("No se encontró el producto");
            return false;
        }
    };

    const checkSupermercadoExists = async (nombre) => {
        try {
            const response = await fetch(`${ruta}/buscar-super/${nombre}`);
            const data = await response.json();
            return response.ok && data.supermercado !== null;
        } catch (error) {
            console.error(error);
            setMessage("No se encontró el supermercado");
            return false;
        }
    };

    const handleInsert = async (e) => {
        e.preventDefault();

        const productoExiste = await checkProductExists(nombreProducto);
        const superExiste = await checkSupermercadoExists(nombreSuper);

        if (!productoExiste) {
            setMessage("El producto no existe");
            return;
        }

        if (!superExiste) {
            setMessage("El supermercado no existe");
            return;
        }

        const precioFinal = `${precio}€`;

        try {
            const response = await fetch(`${ruta}/insert-producto-super`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombreProducto,
                    nombreSuper,
                    precio: precioFinal,
                    valoracion,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Producto asociado al supermercado correctamente");
                setNombreProducto("");
                setNombreSuper("");
                setPrecio("");
                setValoracion("");
            } else {
                setMessage(data.message || "No se pudo insertar.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Ha ocurrido un error");
        }
    };

    // Función para eliminar un producto en el supermercado
    const handleEliminar = async () => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${ruta}/eliminar-producto-super`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombreProducto,
                    nombreSuper,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Relación eliminada con éxito");
                setNombreProducto("");
                setNombreSuper("");
                setPrecio("");
                setValoracion("");
            } else {
                setMessage(data.message || "No se pudo eliminar");
            }
        } catch (error) {
            console.error(error);
            setMessage("Ha ocurrido un error");
        }
    };

    // Función para editar un producto de un supermercado
    const handleEditar = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${ruta}/editar-producto-super`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombreProducto,
                    nombreSuper,
                    nuevoPrecio: precio,
                    nuevaValoracion: valoracion,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Relación actualizada correctamente.");
                setNombreProducto("");
                setNombreSuper("");
                setPrecio("");
                setValoracion("");
            } else {
                setMessage(data.message || "No se pudo editar.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Ha ocurrido un error");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => toggleVista("insertar")}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                    {vista === "insertar" ? "Ocultar Insertar" : "Insertar Producto-Super"}
                </button>

                <button
                    onClick={() => toggleVista("editar")}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                    {vista === "editar" ? "Ocultar Editar" : "Editar Producto-Super"}
                </button>

                <button
                    onClick={() => toggleVista("eliminar")}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                    {vista === "eliminar" ? "Ocultar Eliminar" : "Eliminar Producto-Super"}
                </button>
            </div>

            {/* Formulario para insertar */}
            {vista === "insertar" && (
                <form onSubmit={handleInsert} className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
                    <h2 className="text-xl font-bold">Asociar Producto a Supermercado</h2>
                    <input
                        type="text"
                        placeholder="Nombre del Producto"
                        value={nombreProducto}
                        onChange={(e) => setNombreProducto(e.target.value)}
                        required
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Nombre del Supermercado"
                        value={nombreSuper}
                        onChange={(e) => setNombreSuper(e.target.value)}
                        required
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Precio (sin el símbolo de €)"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                        min="0"
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Valoración"
                        value={valoracion}
                        onChange={(e) => setValoracion(e.target.value)}
                        required
                        min="0"
                        max="5"
                        className="w-full border p-2 rounded"
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Insertar
                    </button>
                </form>
            )}

            {/* Formulario para editar */}
            {vista === "editar" && (
                <form onSubmit={handleEditar} className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
                    <h2 className="text-xl font-bold">Editar Producto-Supermercado</h2>
                    <input
                        type="text"
                        placeholder="Nombre del Producto"
                        value={nombreProducto}
                        onChange={(e) => setNombreProducto(e.target.value)}
                        required
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Nombre del Supermercado"
                        value={nombreSuper}
                        onChange={(e) => setNombreSuper(e.target.value)}
                        required
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Nuevo Precio"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                        min="0"
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Nueva Valoración"
                        value={valoracion}
                        onChange={(e) => setValoracion(e.target.value)}
                        required
                        min="0"
                        max="5"
                        className="w-full border p-2 rounded"
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Editar
                    </button>
                </form>
            )}

            {/* Formulario para eliminar */}
            {/* Formulario para eliminar */}
            {vista === "eliminar" && (
                <form onSubmit={handleEliminar} className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
                    <h2 className="text-xl font-bold">Eliminar Producto-Supermercado</h2>

                    {/* Campo para ingresar el nombre del Producto */}
                    <input
                        type="text"
                        placeholder="Nombre del Producto"
                        value={nombreProducto}
                        onChange={(e) => setNombreProducto(e.target.value)}
                        required
                        className="w-full border p-2 rounded"
                    />

                    {/* Campo para ingresar el nombre del Supermercado */}
                    <input
                        type="text"
                        placeholder="Nombre del Supermercado"
                        value={nombreSuper}
                        onChange={(e) => setNombreSuper(e.target.value)}
                        required
                        className="w-full border p-2 rounded"
                    />

                    {/* Botón para eliminar */}
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Eliminar
                    </button>
                </form>
            )}


            {/* Mensaje de respuesta */}
            {message && <p className="mt-6 text-center text-sm text-gray-700 font-medium">{message}</p>}
        </div>
    );
};

export default ProSuper;
