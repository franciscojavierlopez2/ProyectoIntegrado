import { useState } from "react";

const Supermercado = () => {
  const [vista, setVista] = useState(null); // 'insertar', 'editar', 'eliminar'

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [message, setMessage] = useState("");

  const [supermercado, setSupermercado] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaDireccion, setNuevaDireccion] = useState("");
  const ruta = "http://localhost:5000/api";


  const toggleVista = (nuevaVista) => {
    setMessage("");
    setVista(vista === nuevaVista ? null : nuevaVista);
    setNombre("");
    setDireccion("");
    setSupermercado(null);
    setNuevoNombre("");
    setNuevaDireccion("");
  };

  const checkSupermercadoExists = async (nombre) => {
    try {
      const response = await fetch(`${ruta}/buscar-super/${nombre}`);
      const data = await response.json();
      return response.ok && data.supermercado !== null;
    } catch (error) {
      console.error(error);
      setMessage("Ha ocurrido un error");
      return false;
    }
  };

  const handleInsert = async (e) => {
    e.preventDefault();

    const exists = await checkSupermercadoExists(nombre);
    if (exists) {
      setMessage("Ya existe un supermercado con ese nombre");
      return;
    }

    try {
      const response = await fetch(`${ruta}/insert-super`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, direccion }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Supermercado insertado");
        setNombre("");
        setDireccion("");
      } else {
        setMessage(data.message || "No se pudo insertar el supermercado");
      }
    } catch (error) {
      console.error(error);
      setMessage("Ha ocurrido un error");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ruta}/eliminar-super/${nombre}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Supermercado eliminado");
        setNombre("");
      } else {
        setMessage(data.message || "No se pudo eliminar el supermercado");
      }
    } catch (error) {
      console.error(error);
      setMessage("Ha ocurrido un error");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ruta}/buscar-super/${nombre}`);
      const data = await response.json();

      if (response.ok && data.supermercado) {
        setSupermercado(data.supermercado);
        setNuevoNombre(data.supermercado.nombre);
        setNuevaDireccion(data.supermercado.direccion);
        setMessage("");
      } else {
        setSupermercado(null);
        setMessage(data.message || "Supermercado no encontrado.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Ha ocurrido un error");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ruta}/editar-super`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, nuevoNombre, nuevaDireccion }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Supermercado actualizado");
        setNombre("");
        setNuevoNombre("");
        setNuevaDireccion("");
        setSupermercado(null);
      } else {
        setMessage(data.message || "No se pudo actualizar el supermercado.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Ha ocurrido un error");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="flex gap-4 mb-6">
        {["insertar", "editar", "eliminar"].map((tipo) => (
          <button
            key={tipo}
            onClick={() => toggleVista(tipo)}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            {vista === tipo ? `Ocultar ${tipo}` : `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} Supermercado`}
          </button>
        ))}
      </div>

      {vista === "insertar" && (
        <form onSubmit={handleInsert} className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold">Insertar Supermercado</h2>
          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full border p-2 rounded" />
          <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} required className="w-full border p-2 rounded" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Insertar</button>
        </form>
      )}

      {vista === "editar" && (
        <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold">Editar Supermercado</h2>
          <form onSubmit={handleSearch} className="space-y-2">
            <input type="text" placeholder="Buscar por nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full border p-2 rounded" />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Buscar</button>
          </form>

          {supermercado && (
            <form onSubmit={handleEdit} className="space-y-2 mt-4">
              <input type="text" placeholder="Nuevo nombre" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} required className="w-full border p-2 rounded" />
              <input type="text" placeholder="Nueva dirección" value={nuevaDireccion} onChange={(e) => setNuevaDireccion(e.target.value)} required className="w-full border p-2 rounded" />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Guardar Cambios</button>
            </form>
          )}
        </div>
      )}

      {vista === "eliminar" && (
        <form onSubmit={handleDelete} className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold">Eliminar Supermercado</h2>
          <input type="text" placeholder="Nombre del supermercado" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full border p-2 rounded" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Eliminar</button>
        </form>
      )}

      {message && <p className="mt-6 text-center text-sm text-gray-700 font-medium">{message}</p>}
    </div>
  );
};

export default Supermercado;
