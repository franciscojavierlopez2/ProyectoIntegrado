import { useState } from "react";

const Producto = () => {
  const [vista, setVista] = useState(null);

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [message, setMessage] = useState("");

  const [producto, setProducto] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoTipo, setNuevoTipo] = useState("");
  const ruta = "http://localhost:5000/api";

  const toggleVista = (nuevaVista) => {
    setMessage("");
    setVista(vista === nuevaVista ? null : nuevaVista);
    setNombre("");
    setTipo("");
    setProducto(null);
    setNuevoNombre("");
    setNuevoTipo("");
  };

  const checkProductExists = async (nombre) => {
    try {
      const response = await fetch(`${ruta}/buscar-producto/${nombre}`);
      const data = await response.json();
      return response.ok && data.producto !== null;
    } catch (error) {
      console.error("No se ha encontrado el producto:", error);
      setMessage("No se encontró el producto");
      return false;
    }
  };

  const handleInsert = async (e) => {
    e.preventDefault();

    const productExists = await checkProductExists(nombre);
    if (productExists) {
      setMessage("Ya existe un producto con ese nombre");
      return;
    }

    try {
      const response = await fetch(`${ruta}/insert-producto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, tipo }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Producto insertado");
        setNombre("");
        setTipo("");
      } else {
        setMessage(data.message || "No se pudo insertar el producto");
      }
    } catch (error) {
      console.error(error);
      setMessage("Ha ocurrido un error");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ruta}/eliminar-producto/${nombre}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      

      const data = await response.json();
      if (response.ok) {
        setMessage("Producto eliminado correctamente");
        setNombre("");
      } else {
        setMessage(data.message || "No se pudo eliminar el producto");
      }
    } catch (error) {
      console.error(error);
      setMessage("Ha ocurrido un error");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ruta}/buscar-producto/${nombre}`);
      const data = await response.json();

      if (response.ok && data.producto) {
        setProducto(data.producto);
        setNuevoNombre(data.producto.nombre);
        setNuevoTipo(data.producto.tipo);
        setMessage("");
      } else {
        setProducto(null);
        setMessage(data.message || "Producto no encontrado.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Ha ocurrido un error");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ruta}/editar-producto`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, nuevoNombre, nuevoTipo }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Producto actualizado correctamente.");
        setNombre("");
        setNuevoNombre("");
        setNuevoTipo("");
        setProducto(null);
      } else {
        setMessage(data.message || "No se pudo actualizar el producto.");
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
            {vista === tipo ? `Ocultar ${tipo}` : `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} Producto`}
          </button>
        ))}
      </div>

      {vista === "insertar" && (
        <form onSubmit={handleInsert} className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold">Insertar Producto</h2>
          <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full border p-2 rounded" />
          <input type="text" placeholder="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} required className="w-full border p-2 rounded" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Insertar</button>
        </form>
      )}

      {vista === "editar" && (
        <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold">Editar Producto</h2>
          <form onSubmit={handleSearch} className="space-y-2">
            <input type="text" placeholder="Buscar por nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full border p-2 rounded" />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Buscar</button>
          </form>

          {producto && (
            <form onSubmit={handleEdit} className="space-y-2 mt-4">
              <input type="text" placeholder="Nuevo nombre" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} required className="w-full border p-2 rounded" />
              <input type="text" placeholder="Nuevo tipo" value={nuevoTipo} onChange={(e) => setNuevoTipo(e.target.value)} required className="w-full border p-2 rounded" />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Guardar Cambios</button>
            </form>
          )}
        </div>
      )}

      {vista === "eliminar" && (
        <form onSubmit={handleDelete} className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold">Eliminar Producto</h2>
          <input type="text" placeholder="Nombre del producto" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full border p-2 rounded" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Eliminar</button>
        </form>
      )}

      {message && <p className="mt-6 text-center text-sm text-gray-700 font-medium">{message}</p>}
    </div>
  );
};

export default Producto;
