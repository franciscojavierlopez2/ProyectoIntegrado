"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../../components/Navbar.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const router = useRouter();
  const [recetas, setRecetas] = useState([]);
  const [users, setUsers] = useState([]);
  const [productos, setProductos] = useState([]);
  const [supers, setSupers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingSuper, setLoadingSuper] = useState(true);
  const [recetasEncontradas, setrecetasEncontradas] = useState('');
  const [usersEncontrados, setusersEncontrados] = useState('');
  const [productosEncontrados, setproductosEncontrados] = useState('');
  const [supersEncontrados, setsupersEncontrados] = useState('');
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const [mostrarModalReceta, setMostrarModalReceta] = useState(false);

  const [userSeleccionado, setUserSeleccionado] = useState(null);
  const [mostrarModalUser, setMostrarModalUser] = useState(false);

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);

  const [superSeleccionado, setSuperSeleccionado] = useState(null);
  const [mostrarModalSuper, setMostrarModalSuper] = useState(false);


  const listRecetas = recetas.filter((receta) =>
    receta.nombre.toLowerCase().includes(recetasEncontradas.toLowerCase())
  );

  const listUsers = users.filter((user) =>
    user.nombre.toLowerCase().includes(usersEncontrados.toLowerCase()) ||
    user.username.toLowerCase().includes(usersEncontrados.toLowerCase())
  );

  const listProductos = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(productosEncontrados.toLowerCase())
  );

  const listSupers = supers.filter((market) =>
    market.nombre.toLowerCase().includes(supersEncontrados.toLowerCase())

  );

  const ruta = "http://localhost:5000/api";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Usuario no autenticado");
      router.push("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.rol !== "admin") {
        alert("No tienes permisos");
        router.push("/");
        return;
      }

      const ahora = Date.now() / 1000;
      if (decoded.exp && decoded.exp < ahora) {
        alert("Token expirado");
        localStorage.removeItem("token");
        router.push("/");
        return;
      }

    } catch (error) {
      console.error(error);
      alert("Token invalido");
      localStorage.removeItem("token");
      router.push("/");
      return;
    }
  }, [router]);

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${ruta}/recetas`);
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
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${ruta}/usuarios`);
        const data = await res.json();

        if (res.ok) {
          setUsers(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUsuarios();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;


        const res = await fetch(`${ruta}/products`);
        const data = await res.json();

        if (res.ok) {
          setProductos(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchSupers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${ruta}/supers`);
        const data = await res.json();

        if (res.ok) {
          setSupers(data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSuper(false);
      }
    };

    fetchSupers();
  }, []);



  const handleDeleteUser = async (username) => {
    try {
      const response = await fetch(`${ruta}/eliminar-user/${username}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setUsers(users.filter(user => user.username !== username));
      } else {
        const data = await response.json();
        console.error(data.message || "No se pudo elimiminar el usuario");
      }
    } catch (error) {
      console.error(error);
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
      } else {
        const data = await response.json();
        console.error(data.message || "No se pudo eliminar la receta");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSuper = async (nombre) => {
    try {
      const response = await fetch(`${ruta}/eliminar-super/${nombre}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setSupers(supers.filter(market => market.nombre !== nombre));
      } else {
        const data = await response.json();
        console.error(data.message || "No se pudo eliminar el supermercado");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProducto = async (nombre) => {
    try {
      const response = await fetch(`${ruta}/eliminar-producto/${nombre}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setProductos(productos.filter(producto => producto.nombre !== nombre));
      } else {
        const data = await response.json();
        console.error(data.message || "No se pudo eliminar el producto");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const abrirModalReceta = (receta) => {
    setRecetaSeleccionada(receta);
    setMostrarModalReceta(true);
  };

  const cerrarModalReceta = () => {
    setMostrarModalReceta(false);
    setRecetaSeleccionada(null);
  };

  const abrirModalUser = (user) => {
    setUserSeleccionado(user);
    setMostrarModalUser(true);
  };

  const cerrarModalUser = () => {
    setMostrarModalUser(false);
    setUserSeleccionado(null);
  };

  const abrirModalProducto = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarModalProducto(true);
  };

  const cerrarModalProducto = () => {
    setMostrarModalProducto(false);
    setProductoSeleccionado(null);
  };

  const abrirModalSuper = (supermercado) => {
    setSuperSeleccionado(supermercado);
    setMostrarModalSuper(true);
  };

  const cerrarModalSuper = () => {
    setMostrarModalSuper(false);
    setSuperSeleccionado(null);
  };

  return (
     
    <>
      <Navbar />
      <div className="container mt-4 ">
        <h2 className="mb-4">Listado de todas las Recetas</h2>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Buscar recetas"
          value={recetasEncontradas}
          onChange={(e) => setrecetasEncontradas(e.target.value)}
          style={{ width: '200px' }}
        />
        {loading ? (
          <p>Cargando recetas...</p>
        ) : recetas.length === 0 ? (
          <p>No se encontraron recetas</p>
        ) : (
          <div className="row">
            {listRecetas.slice(0, 3).map((receta) => (
              <div
                key={receta.idReceta}
                className="col-md-4 mb-4"
                onClick={() => abrirModalReceta(receta)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card h-100 d-flex flex-column align-items-center text-center">
                  <div className="card-body d-flex flex-column align-items-center">
                    <h5 className="card-title">{receta.nombre}</h5>
                    <p className="card-text">
                      <strong>Pasos:</strong> <br />
                      {receta.pasos.length > 100 ? receta.pasos.slice(0, 100) + "..." : receta.pasos}
                    </p>
                    <p><strong>Dificultad:</strong> {receta.dificultad}</p>
                    <p><strong>Tiempo:</strong> {receta.tiempo_elaboracion}</p>
                    <button
                      className="btn btn-danger mt-3"
                      onClick={(e) => {
                        e.stopPropagation(); // Evita abrir el modal
                        handleDeleteReceta(receta.nombre);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>

            ))}
          </div>

        )}
      </div>
      <div className="container mt-4">
        <h2 className="mb-4">Listado de todos los Usuarios</h2>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Buscar usuarios"
          value={usersEncontrados}
          onChange={(e) => setusersEncontrados(e.target.value)}
          style={{ width: '200px' }}
        />
        {loadingUser ? (
          <p>Cargando usuarios...</p>
        ) : users.length === 0 ? (
          <p>No se encontraron usuarios</p>
        ) : (

          <div className="row">
            {listUsers.slice(0, 3).map((user) => (
              <div
                key={user.idUser}
                className="col-md-3 mb-4"
                onClick={() => abrirModalUser(user)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card h-100 d-flex flex-column align-items-center text-center">
                  <img
                    src="/Avatar1.PNG"
                    alt="Perfil"
                    className="mt-3"
                    style={{ width: "120px", height: "120px", borderRadius: "50%"}}
                  />
                  <div className="card-body d-flex flex-column align-items-center">
                    <h5 className="card-title">{user.nombre}</h5>
                    <p><strong>Apellidos:</strong> {user.apellidos}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <button
                      className="btn btn-danger mt-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteUser(user.username);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>

            ))}
          </div>

        )}
      </div>
      <div className="container mt-4">
        <h2 className="mb-4">Listado de todas los Productos</h2>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Buscar productos"
          value={productosEncontrados}
          onChange={(e) => setproductosEncontrados(e.target.value)}
          style={{ width: '200px' }}
        />
        {loadingProduct ? (
          <p>Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p>No se encontraron productos</p>
        ) : (

          <div className="row">
            {listProductos.slice(0, 3).map((pro) => (
              <div
                key={pro.idPro}
                className="col-md-4 mb-4"
                onClick={() => abrirModalProducto(pro)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card h-100 d-flex flex-column align-items-center text-center" style={{ width: "80%" }}>
                  <div className="card-body d-flex flex-column align-items-center">
                    <h5 className="card-title">{pro.nombre}</h5>
                    <p><strong>Tipo:</strong> {pro.tipo}</p>
                    <button
                      className="btn btn-danger mt-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProducto(pro.nombre);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>

            ))}
          </div>

        )}
      </div>
      <div className="container mt-4">
        <h2 className="mb-4">Listado de todos los Supermercados</h2>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Buscar supermercados"
          value={supersEncontrados}
          onChange={(e) => setsupersEncontrados(e.target.value)}
          style={{ width: '200px' }}
        />
        {loadingSuper ? (
          <p>Cargando supermercados...</p>
        ) : listSupers.length === 0 ? (
          <p>No se encontraron supermercados</p>
        ) : (

          <div className="row">
            {listSupers.slice(0, 3).map((market) => (
              <div
                key={market.idSuper}
                className="col-md-4 mb-4"
                onClick={() => abrirModalSuper(market)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card h-100 d-flex flex-column align-items-center text-center">
                  <div className="card-body d-flex flex-column align-items-center">
                    <h5 className="card-title">{market.nombre}</h5>
                    <p><strong>Dirección:</strong> {market.direccion}</p>
                    
                    <button
                      className="btn btn-danger mt-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSuper(market.nombre);
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>

            ))}
          </div>

        )}
      </div>
      {mostrarModalReceta && recetaSeleccionada && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{recetaSeleccionada.nombre}</h5>
              </div>
              <div className="modal-body">
                <p><strong>Pasos:</strong> {recetaSeleccionada.pasos}</p>
                <p><strong>Dificultad:</strong> {recetaSeleccionada.dificultad}</p>
                <p><strong>Tiempo:</strong> {recetaSeleccionada.tiempo_elaboracion}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-dark" onClick={cerrarModalReceta}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {mostrarModalUser && userSeleccionado && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{userSeleccionado.nombre} {userSeleccionado.apellidos}</h5>
              </div>
              <div className="modal-body">
                <p><strong>Username:</strong> {userSeleccionado.username}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-dark" onClick={cerrarModalUser}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {mostrarModalProducto && productoSeleccionado && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{productoSeleccionado.nombre}</h5>
              </div>
              <div className="modal-body">
                <p><strong>Tipo:</strong> {productoSeleccionado.tipo}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-dark" onClick={cerrarModalProducto}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {mostrarModalSuper && superSeleccionado && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{superSeleccionado.nombre}</h5>
              </div>
              <div className="modal-body">
                <p><strong>Dirección:</strong> {superSeleccionado.direccion}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-dark" onClick={cerrarModalSuper}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  )
}

export default Dashboard;
