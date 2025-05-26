"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../../../components/Navbar.jsx";

import 'bootstrap/dist/css/bootstrap.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Dashboard = () => {

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

  const listRecetas = recetas.filter((receta) =>
    receta.nombre.toLowerCase().includes(recetasEncontradas.toLowerCase())
  );

  const listUsers = users.filter((user) =>
    user.nombre.toLowerCase().includes(usersEncontrados.toLowerCase()) ||
    user.apellidos.toLowerCase().includes(usersEncontrados.toLowerCase()) ||
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
    const fetchRecetas = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          alert("Usuario no autenticado.");
          return;
        }

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
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          alert("Usuario no autenticado");
          return;
        }

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
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          alert("Usuario no autenticado.");
          return;
        }

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
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          alert("Usuario no autenticado.");
          return;
        }

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


  return (
    <>
      <Navbar />
      <div className="container mt-4">
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
            {listRecetas.map((receta) => (
              <div key={receta.idReceta} className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{receta.nombre}</h5>
                    <p className="card-text">
                      <strong>Pasos: </strong> <br />
                      {receta.pasos.length > 100 ? receta.pasos.slice(0, 100) + "..." : receta.pasos}
                    </p>
                    <p><strong>Dificultad:</strong> {receta.dificultad}</p>
                    <p><strong>Tiempo:</strong> {receta.tiempo_elaboracion}</p>
                    <div className="d-flex justify-content-center mt-3">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteReceta(receta.nombre)}
                      >
                        Eliminar
                      </button>
                    </div>
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
            {listUsers.map((user) => (
              <div key={user.idUser} className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{user.nombre}</h5>
                    <p><strong>Apellidos:</strong> {user.apellidos}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <div className="d-flex justify-content-center mt-3">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteUser(user.username)}
                      >
                        Eliminar
                      </button>
                    </div>

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
            {listProductos.map((pro) => (
              <div key={pro.idPro} className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{pro.nombre}</h5>
                    <p><strong>Tipo:</strong> {pro.tipo}</p>
                    <div className="d-flex justify-content-center mt-3">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteProducto(pro.nombre)}
                      >
                        Eliminar
                      </button>
                    </div>

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
          placeholder="Buscar usuarios"
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
            {listSupers.map((market) => (
              <div key={market.idSuper} className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{market.nombre}</h5>
                    <p><strong>Direccion:</strong> {market.direccion}</p>
                    <div className="d-flex justify-content-center mt-3">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteSuper(market.nombre)}
                      >
                        Eliminar
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Dashboard;
