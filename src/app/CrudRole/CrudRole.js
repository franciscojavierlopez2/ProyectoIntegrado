import { useState } from "react";

const Rol = () => {
  const [vista, setVista] = useState(null);

  const [nombre, setNombre] = useState("");
  const [message, setMessage] = useState("");

  const [rol, setRol] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const ruta = "http://localhost:5000/api";


  const toggleVista = (nuevaVista) => {
    setMessage("");
    setVista(vista === nuevaVista ? null : nuevaVista);
    setNombre("");
    setRol(null);
    setNuevoNombre("");
  };

  const checkRolExists = async (nombre) => {
    try {
      const response = await fetch(`${ruta}/buscar-role/${nombre}`);
      const data = await response.json();
      return response.ok && data.rol !== null;
    } catch (error) {
      console.error(error);
      setMessage("Ha ocurrido un error");
      return false;
    }
  };

  const handleInsert = async (e) => {
    e.preventDefault();

    const rolExists = await checkRolExists(nombre);
    if (rolExists) {
      setMessage("Ya existe un rol con ese nombre.");
      return;
    }

    try {
      const response = await fetch(`${ruta}/insert-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Rol insertado correctamente.");
        setNombre("");
      } else {
        setMessage(data.message || "No se pudo insertar el rol.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Ha ocurrido un error");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ruta}/eliminar-role/${nombre}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Rol eliminado");
        setNombre("");
      } else {
        setMessage(data.message || "No se pudo eliminar el rol.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Ha ocurrido un error");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ruta}/buscar-role/${nombre}`);
      const data = await response.json();

      if (response.ok && data.rol) {
        setRol(data.rol);
        setNuevoNombre(data.rol.nombre);
        setMessage("");
      } else {
        setRol(null);
        setMessage(data.message || "Rol no encontrado.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Ha ocurrido un error");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ruta}/editar-rol`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre, nuevoNombre: nuevoNombre }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Rol actualizado");
        setNombre("");
        setNuevoNombre("");
        setRol(null);
      } else {
        setMessage(data.message || "No se pudo actualizar el rol.");
      }
    } catch (error) {
      console.error("Error:", error);
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
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            {vista === tipo ? `Ocultar ${tipo}` : `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} Rol`}
          </button>
        ))}
      </div>

      {vista === "insertar" && (
        <form onSubmit={handleInsert} className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold">Insertar Rol</h2>
          <input type="text" placeholder="Nombre del Rol" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full border p-2 rounded" />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Insertar</button>
        </form>
      )}

      {vista === "editar" && (
        <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold">Editar Rol</h2>
          <form onSubmit={handleSearch} className="space-y-2">
            <input type="text" placeholder="Buscar por nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full border p-2 rounded" />
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Buscar</button>
          </form>

          {rol && (
            <form onSubmit={handleEdit} className="space-y-2 mt-4">
              <input type="text" placeholder="Nuevo nombre" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} required className="w-full border p-2 rounded" />
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Guardar Cambios</button>
            </form>
          )}
        </div>
      )}

      {vista === "eliminar" && (
        <form onSubmit={handleDelete} className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold">Eliminar Rol</h2>
          <input type="text" placeholder="Nombre del rol" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full border p-2 rounded" />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Eliminar</button>
        </form>
      )}

      {message && <p className="mt-6 text-center text-sm text-gray-700 font-medium">{message}</p>}
    </div>
  );
};

export default Rol;
