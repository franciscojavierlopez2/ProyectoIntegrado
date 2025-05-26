import { useState } from "react";

const User = () => {
  const [vista, setVista] = useState(null);

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [user, setUser] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoApellidos, setNuevoApellidos] = useState("");
  const [nuevoUsername, setNuevoUsername] = useState("");
  const [nuevoPassword, setNuevoPassword] = useState("");
  const ruta = "http://localhost:5000/api";

  const toggleVista = (nuevaVista) => {
    setMessage("");
    setVista(vista === nuevaVista ? null : nuevaVista);
    setNombre("");
    setApellidos("");
    setUsername("");
    setPassword("");
    setUser(null);
    setNuevoNombre("");
    setNuevoApellidos("");
    setNuevoUsername("");
    setNuevoPassword("");
  };

  const checkUserExists = async (username) => {
    try {
      const response = await fetch(`${ruta}/buscar-user/${username}`);
      const data = await response.json();
      return response.ok && data.user !== null;
    } catch (error) {
      console.error("Error al buscar el usuario:", error);
      setMessage("Hubo un problema al comprobar si el usuario existe.");
      return false;
    }
  };

  const handleInsert = async (e) => {
    e.preventDefault();

    const userExists = await checkUserExists(username);
    if (userExists) {
      setMessage("Ya existe un usuario con ese nombre.");
      return;
    }

    try {
      const response = await fetch(`${ruta}/insert-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellidos, username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Usuario insertado");
        setNombre("");
        setApellidos("");
        setUsername("");
        setPassword("");
      } else {
        setMessage(data.message || "no se pudo insertar el usuario");
      }
    } catch (error) {
      console.error(error);
      setMessage("Ha ocurrido un error");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ruta}/eliminar-user/${username}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Usuario eliminado");
        setNombre("");
        setApellidos("");
        setUsername("");
        setPassword("");
      } else {
        setMessage(data.message || "No se pudo eliminar el usuario");
      }
    } catch (error) {
      console.error(error);
      setMessage("Ha ocurrido un error");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ruta}/buscar-user/${username}`);
      const data = await response.json();

      if (response.ok && data.user) {
        setUser(data.user);
        setNuevoNombre(data.user.nombre);
        setNuevoApellidos(data.user.apellidos);
        setNuevoUsername(data.user.username);
        setNuevoPassword(data.user.password);
        setMessage("");
      } else {
        setUser(null);
        setMessage(data.message || "Usuario no encontrado.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Ha ocurrido un error");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ruta}/editar-user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, nuevoNombre, nuevoApellidos, nuevoUsername, nuevoPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Usuario actualizado");
        setUsername("");
        setNuevoNombre("");
        setNuevoApellidos("");
        setNuevoUsername("");
        setNuevoPassword("");
        
        setUser(null);
      } else {
        setMessage(data.message || "no se pudo actualizar el usuario.");
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
            {vista === tipo ? `Ocultar ${tipo}` : `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} Usuario`}
          </button>
        ))}
      </div>

      {vista === "insertar" && (
        <form onSubmit={handleInsert} className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold">Insertar Usuario</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Insertar
          </button>
        </form>
      )}

      {vista === "editar" && (
        <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold">Editar Usuario</h2>
          <form onSubmit={handleSearch} className="space-y-2">
            <input
              type="text"
              placeholder="Buscar por username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Buscar
            </button>
          </form>

          {user && (
            <form onSubmit={handleEdit} className="space-y-2 mt-4">
              <input
                type="text"
                placeholder="Nuevo nombre"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Nuevo apellidos"
                value={nuevoApellidos}
                onChange={(e) => setNuevoApellidos(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Nuevo username"
                value={nuevoUsername}
                onChange={(e) => setNuevoUsername(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="password"
                placeholder="Nuevo password"
                value={nuevoPassword}
                onChange={(e) => setNuevoPassword(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Guardar Cambios
              </button>
            </form>
          )}
        </div>
      )}

      {vista === "eliminar" && (
        <form onSubmit={handleDelete} className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold">Eliminar Usuario</h2>
          <input
            type="text"
            placeholder="Username del usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Eliminar
          </button>
        </form>
      )}

      {message && <p className="mt-6 text-center text-sm text-gray-700 font-medium">{message}</p>}
    </div>
  );
};

export default User;
