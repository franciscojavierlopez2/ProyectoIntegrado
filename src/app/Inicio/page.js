"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../../../components/Navbar.jsx";

const Inicio = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [respuesta, setRespuesta] = useState(null);
  const [editformulario, setEditFormulario] = useState(null);
  const [insertFormulario, setInsertFormulario] = useState(null);
  const ruta = "http://localhost:5000/api";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Usuario no autenticado");
      router.push("/")
      return;
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [{ type: "user", text: input }, ...prev]);

    const res = await fetch(`${ruta}/wit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setRespuesta(data);

    const intent = data?.intents?.[0]?.name || null;

    const textoIa = await handleIntent(intent, data);

    setMessages(prev => [{ type: "bot", text: textoIa }, ...prev]);
    setInput("");
  };


  const handleIntent = async (intent, data) => {
    switch (intent) {
      case "crear_producto": {
        const producto = data?.entities?.["producto:producto"]?.[0];
        const tipo = data?.entities?.["tipo:tipo"]?.[0];
        return await handleCrearProducto(producto, tipo);
      }
      case "Editar_Receta": {
        const receta = data?.entities?.["Receta:Receta"]?.[0]?.value;
        if (!receta) return "Por favor, proporciona el nombre de la receta a editar.";
        return await handleEditarReceta(receta);
      }

      case "InsertarReceta": {
        const nombre = data?.entities?.["Receta:Receta"]?.[0]?.value || "";
        setInsertFormulario({
          nombre,
          pasos: "",
          tiempo_elaboracion: "",
          dificultad: ""
        });
      }
      case "eliminar_receta": {
        const receta = data?.entities?.["Receta:Receta"]?.[0];
        const nombreReceta = receta?.value;
        return await handleEliminarReceta(nombreReceta);
      }
      case "listar_recetas":
        return await handleListarRecetas();
      case "buscar_receta": {
        const nombre = data?.entities?.["Receta:Receta"]?.[0];
        const nombreReceta = nombre?.value;
        if (!nombre) return "No has introducido el nombre de la receta";
        return await handleRecetaConcreta(nombreReceta);
      }
      case "listar_super":
        return await handleListarSupers();
      case "producto_mas_barato": {
        const producto = data?.entities?.["producto:producto"]?.[0]?.value;
        return await handleProductoMasBarato(producto);
      }
      default:
        return "No existe o no tienes permisos para realizar esta funcionalidad";
    }
  };


  const handleCrearProducto = async (productoEntity, tipoEntity) => {
    const nombre = productoEntity?.value;
    const tipo = tipoEntity?.value;

    if (!nombre) {
      return "No se puede crear el producto sin el nombre";
    }

    try {
      const res = await fetch(`${ruta}/insert-producto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, tipo }),
      });

      const data = await res.json();

      if (res.ok) {
        return ` Se ha creado el producto ${nombre}`;
      } else {
        return `${data.message}`;
      }
    } catch (error) {
      console.error(error);
      return "No se ha podido crear el producto";
    }
  };

  const handleListarRecetas = async () => {
    try {
      const res = await fetch(`${ruta}/recetas`);
      if (!res.ok) {
        return "No se pudieron cargar las recetas";
      }
      const recetas = await res.json();
      if (recetas.length === 0) return "No hay recetas disponibles.";

      const lista = recetas.map(r => `- ${r.nombre}`).join('\n');
      return `Recetas disponibles: ${lista}`;
    } catch (error) {
      console.error(error);
      return "No se pudieron obtener las recetas";
    }
  };

  const handleRecetaConcreta = async (nombre) => {
    try {
      const res = await fetch(`${ruta}/receta-concreta/${nombre}`);
      if (!res.ok) {
        if (res.status === 404) return `No se encontraron recetas con el nombre "${nombre}"`;
        return "Error al buscar la receta";
      }
      const recetas = await res.json();
      if (recetas.length === 0) return `No se encontraron recetas`;

      const lista = recetas.map(r => `- ${r.nombre}`).join('\n');
      return `Recetas encontradas para ${nombre}:\n${lista}`;
    } catch (error) {
      console.error(error);
      return "No se pudieron obtener las recetas";
    }
  };

  const handleInsertarReceta = async () => {
    const { nombre, pasos, tiempo_elaboracion, dificultad } = insertFormulario;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("No estás autenticado");
      return;
    }
    const user = JSON.parse(storedUser);
    const idUser = user.id;

    try {
      const res = await fetch(`${ruta}/insert-receta/${idUser}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, pasos, tiempo_elaboracion, dificultad }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Receta insertada con éxito.");
        setInsertFormulario(null);
        setMessages(mensajeAnterior => [{ type: "bot", text: `Se ha creado la receta: ${nombre}` }, ...mensajeAnterior]);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error al guardar la receta");
    }
  };


  const handleEliminarReceta = async (nombre) => {
    if (!nombre) return "No se ha encontrado ninguna receta con ese nombre";

    const storedUser = localStorage.getItem("user");
    if (!storedUser) return "No estás autenticado";

    const user = JSON.parse(localStorage.getItem("user"));
    const idUser = user.id;

    try {
      const res = await fetch(`${ruta}/eliminar-receta/${encodeURIComponent(nombre)}/${idUser}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        if (res.status === 404) return `No se encontró tu receta ${nombre}`;
        return "Error al eliminar la receta";
      }

      const data = await res.json();
      return data.message || "Receta eliminada";
    } catch (error) {
      console.error(error);
      return "Error al eliminar la receta";
    }
  };

  const handleEditarReceta = async (nombre) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return "No estas autenticado";
    const user = JSON.parse(storedUser);
    const idUser = user.id;

    try {
      const res = await fetch(`${ruta}/editar-receta/${encodeURIComponent(nombre)}/${idUser}`);
      const data = await res.json();

      if (!data || data.idUser !== idUser) {
        return "No se encontró una receta tuya con ese nombre.";
      }

      setEditFormulario({
        idUser,
        nombreOriginal: data.nombre,
        nombre: data.nombre,
        pasos: data.pasos,
        tiempo_elaboracion: data.tiempo_elaboracion,
        dificultad: data.dificultad
      });

    } catch (error) {
      console.error(error);
      return "Error al editar la receta";
    }
  };

  const handleGuardarCambios = async () => {
    const { nombreOriginal, nombre, pasos, tiempo_elaboracion, dificultad, idUser } = editformulario;

    try {
      const res = await fetch(`${ruta}/editar-receta/${encodeURIComponent(nombreOriginal)}/${idUser}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoNombre: nombre, pasos, tiempo_elaboracion, dificultad })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Receta editada");
      } else {
        alert("Error: " + data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Error al guardar cambios.");
    }
  };

  const handleListarSupers = async () => {
    try {
      const res = await fetch(`${ruta}/supers`);
      if (!res.ok) {
        return "No se pudieron cargar los supermercados";
      }
      const supers = await res.json();
      if (supers.length === 0) return "No hay supermercados disponibles";

      const lista = supers.map(s => `- ${s.nombre}`).join('\n');
      return `Supermercados disponibles:\n${lista}`;
    } catch (error) {
      console.error(error);
      return "Error al listar los supermercados";
    }
  };

  const handleProductoMasBarato = async (nombreProducto) => {
    if (!nombreProducto) return "Debes introducir el nombre del producto";

    try {
      const res = await fetch(`${ruta}/productos-comparador/${encodeURIComponent(nombreProducto)}`);

      if (!res.ok) {
        return "No se han encontrado productos";
      }

      const data = await res.json();
      const productos = data.productos;

      if (productos.length === 0) return "No hay productos";

      const productosBaratos = productos.slice(0, 3);
      const masBarato = productosBaratos[0];

      let respuesta = `Los tres precios mas baratos para ${nombreProducto} son:\n`;
      productosBaratos.forEach((p, i) => {
        const valoracion = p.valoracion ?? "Sin valoracion";
        respuesta += `${i + 1}. ${p.Supermercado.nombre}: ${p.precio}€ Valoración: ${valoracion}\n`;
      });

      respuesta += `\n El más barato está en ${masBarato.Supermercado.nombre} a ${masBarato.precio}€.`;

      return respuesta;
    } catch (error) {
      console.error(error);
      return "Error al buscar el producto más barato.";
    }
  };


  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <div
          className="mx-auto p-4 rounded shadow"
          style={{
            maxWidth: "800px",
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
          }}
        >
          <h4 className="mb-3 text-center">Asistente de Compras</h4>

          <div
            className="border rounded mb-3 p-3"
            style={{
              height: "350px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column-reverse",
              backgroundColor: "#ffffff",
              border: "1px solid #ced4da",
            }}
          >
            {insertFormulario && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleInsertarReceta();
                }}
                className="p-3 mb-4 rounded px-4 d-inline-block text-wrap bg-dark text-white align-self-end w-75"
              >
                <div className="text-center mb-3">
                  <h5>Insertar Receta</h5>
                </div>
                <div className="mb-2">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={insertFormulario.nombre}
                    onChange={e => setInsertFormulario({ ...insertFormulario, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Pasos</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={insertFormulario.pasos}
                    onChange={e => setInsertFormulario({ ...insertFormulario, pasos: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Tiempo de elaboración</label>
                  <input
                    type="text"
                    className="form-control"
                    value={insertFormulario.tiempo_elaboracion}
                    onChange={e => setInsertFormulario({ ...insertFormulario, tiempo_elaboracion: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Dificultad</label>
                  <input
                    type="text"
                    className="form-control"
                    value={insertFormulario.dificultad}
                    onChange={e => setInsertFormulario({ ...insertFormulario, dificultad: e.target.value })}
                  />
                </div>
                <div className="d-flex justify-content-center gap-3">
                  <button type="submit" className="btn btn-success">Guardar receta</button>
                  <button type="button" className="btn btn-danger" onClick={() => setInsertFormulario(null)}>Cancelar</button>
                </div>
              </form>
            )}

            {editformulario && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleGuardarCambios();
                  const res = await fetch(`${ruta}/editar-receta/${encodeURIComponent(editformulario.nombreOriginal)}/${editformulario.idUser}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      nuevoNombre: editformulario.nombre,
                      pasos: editformulario.pasos,
                      tiempo_elaboracion: editformulario.tiempo_elaboracion,
                      dificultad: editformulario.dificultad,
                    }),
                  });

                  const data = await res.json();

                  if (res.ok) {
                    setMessages(prev => [{ type: "bot", text: `✅ Receta actualizada con éxito: ${data.receta.nombre}` }, ...prev]);
                    setEditFormulario(null);
                  } else {
                    setMessages(prev => [{ type: "bot", text: `❌ Error al actualizar: ${data.message}` }, ...prev]);
                  }
                }}
                className="p-3 mb-4 rounded px-4 d-inline-block text-wrap bg-dark text-white align-self-end w-75"

              >
                <div className="text-center mb-3">
                  <h5>Editar Receta</h5>
                </div>
                <div className="mb-2">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editformulario.nombre}
                    onChange={e => setEditFormulario({ ...editformulario, nombre: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Pasos</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={editformulario.pasos}
                    onChange={e => setEditFormulario({ ...editformulario, pasos: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Tiempo de elaboración</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editformulario.tiempo_elaboracion || ""}
                    onChange={e => setEditFormulario({ ...editformulario, tiempo_elaboracion: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Dificultad</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editformulario.dificultad || ""}
                    onChange={e => setEditFormulario({ ...editformulario, dificultad: e.target.value })}
                  />
                </div>
                <div className="d-flex justify-content-center gap-3">
                  <button type="submit" className="btn btn-success">Guardar cambios</button>
                  <button type="button" className="btn btn-danger" onClick={() => setEditFormulario(null)}>Cancelar</button>
                </div>
              </form>
            )}

            {messages.filter(msg => msg.text && msg.text.trim() !== "").map((msg, idx) => (<div
              key={idx}
              className={`p-2 mb-4 rounded px-4 d-inline-block text-wrap ${msg.type === "user"
                ? "bg-primary text-white align-self-start"
                : "bg-dark text-white align-self-end"
                }`}
              style={{ maxWidth: "65%", wordBreak: "break-word", whiteSpace: "pre-wrap" }}
            >
              {msg.text}
            </div>
            ))}
          </div>


          <form onSubmit={handleSubmit} className="d-flex">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="form-control me-2 shadow-sm"
              placeholder="Escribe un mensaje..."
              style={{ borderRadius: "25px" }}
              disabled={insertFormulario || editformulario}
            />
            <button type="submit" className="btn btn-primary px-4 shadow-sm" disabled={insertFormulario || editformulario}>
              Enviar
            </button>
          </form>

          {respuesta && (
            <div className="mt-4">
              <h6 className="mb-2">Última respuesta de la API:</h6>
              <pre className="bg-dark text-white p-3 rounded small" style={{ maxHeight: "200px", overflowY: "auto" }}>
                {JSON.stringify(respuesta, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </>

  );
};


export default Inicio;
