import { useState } from "react";

const App = () => {
  const [mostrar, setMostrar] = useState(false);
  const [nombre, setNombre] = useState("");
  const [pasos, setPasos] = useState("");
  const [tiempo_elaboracion, setTiempoElaboracion] = useState("");
  const [dificultad, setDificultad] = useState("");
  const [message, setMessage] = useState("");
  const ruta = "http://localhost:5000/api";

  const cambiarFormulario = () => {
    setMostrar((c) => !c);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipeExists = await checkRecipeExists(nombre);
    if (recipeExists) {
      setMessage("Ya existe una receta con ese nombre.");
      return;
    }

    try {
      const recipeData = { nombre, pasos, tiempo_elaboracion,dificultad };

      const response = await fetch(`${ruta}/insert-receta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });

      if (response.ok) {
        setMessage("Receta insertada con éxito");
        setNombre("");
        setTipo("");
      } else {
        const data = await response.json();
        setMessage(data.message || "No se pudo insertar la receta.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Ha ocurrido un error");
    }
  };

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
      setMessage("Ha ocurrido un error");
    }
  };

  const checkRecipeExists = async (nombre) => {
    try {
      const response = await fetch(`${ruta}/buscar-recipe/${nombre}`);
      const data = await response.json();

      return response.ok && data.producto !== null;
    } catch (error) {
      console.error(error);
      setMessage("No se encontró la receta");
      return false;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <button
        onClick={cambiarFormulario}
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mb-6"
      >
        {mostrar ? "Ocultar Formulario" : "Insertar Producto"}
      </button>

      {mostrar && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={cambiarFormulario}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <input
                  type="text"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Insertar
              </button>
              {message && (
                <p className="mt-4 text-center text-sm font-medium text-gray-700">
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
