"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    console.log(storedUser)
    console.log(storedRole)

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error al obtener el usuario: ", error);
      }
    }

    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
    setRole(null);
    router.push("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: "#0B132B", padding: "10px" }}
    >
      <div className="container d-flex align-items-center justify-content-between">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link href="/Inicio" className="nav-link">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link href="/MisRecetas" className="nav-link">Mis Recetas</Link>
            </li>
            <li className="nav-item">
              <Link href="/Recetas  " className="nav-link">Recetas</Link>
            </li>
            <li className="nav-item">
              <Link href="/Perfil" className="nav-link">Perfil</Link>
            </li>
            {role === "admin" && (
              <li className="nav-item">
                <Link href="/Dashboard" className="nav-link">Dashboard</Link>
              </li>
            )}
          </ul>
        

        <div className="d-flex align-items-center">
          {user ? (
            <button
              className="btn ms-2"
              onClick={handleLogout}
              style={{ backgroundColor: "#3A506B", color: "#FFFFFF" }}
            >
              Cerrar sesión
            </button>
          ) : (
            <Link
              href="/"
              className="btn ms-2"
              style={{ backgroundColor: "#3A506B", color: "#FFFFFF" }}
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
