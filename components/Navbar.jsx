"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: "#0B132B", padding: "10px" }}
    >
      <div className="container d-flex align-items-center justify-content-between">
        <ul className="navbar-nav d-none d-lg-flex flex-row me-auto mb-0">
          <li className="nav-item mx-2">
            <Link href="/Inicio" className="nav-link" style={{ fontSize: "1.15rem"}}>Inicio</Link>
          </li>
          <li className="nav-item mx-2" style={{ fontSize: "1.15rem"}}>
            <Link href="/MisRecetas" className="nav-link">Mis Recetas</Link>
          </li>
          <li className="nav-item mx-2" style={{ fontSize: "1.15rem"}}> 
            <Link href="/Recetas  " className="nav-link">Recetas</Link>
          </li>
          <li className="nav-item mx-2" style={{ fontSize: "1.15rem"}}>
            <Link href="/Perfil" className="nav-link">Perfil</Link>
          </li>
          {role === "admin" && (
            <li className="nav-item mx-2" style={{ fontSize: "1.15rem"}}>
              <Link href="/Dashboard" className="nav-link" >Dashboard</Link>
            </li>
          )}
        </ul>
        <div className="d-lg-none position-relative">
          <button
            onClick={toggleDropdown}
            className="btn"
            style={{
              color: 'white',
              fontSize: '1.5rem',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#1C2541';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ☰
          </button>


          {dropdownOpen && (
            <ul
              className="dropdown-menu show position-absolute mt-2"
              style={{ right: 0, left: 2, backgroundColor: '#0B132B', border: 'none', minWidth: '200px' }}
            >
              <Link
                href="/Inicio"
                className="dropdown-item text-white"
                style={{ backgroundColor: "transparent", fontSize: "1.25rem" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1C2541")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Inicio
              </Link>

              <li>
                <Link href="/MisRecetas" className="dropdown-item text-white"
                  style={{ backgroundColor: "transparent", fontSize: "1.25rem" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1C2541")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                  Mis Recetas
                </Link>
              </li>
              <li>
                <Link href="/Recetas" className="dropdown-item text-white"
                  style={{ backgroundColor: "transparent", fontSize: "1.25rem" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1C2541")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                  Recetas
                </Link>
              </li>
              <li>
                <Link href="/Perfil" className="dropdown-item text-white"
                  style={{ backgroundColor: "transparent", fontSize: "1.25rem" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1C2541")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                  Perfil
                </Link>
              </li>
              {role === "admin" && (
                <li>
                  <Link href="/Dashboard" className="dropdown-item text-white"
                    style={{ backgroundColor: "transparent", fontSize: "1.25rem" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1C2541")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>


        <div className="d-flex align-items-center">
          {user ? (
            <button
              className="btn ms-2"
              onClick={handleLogout}
              style={{ backgroundColor: "#3A506B", color: "#FFFFFF",fontSize: "1.15rem"  }}
            >
              Cerrar sesión
            </button>
          ) : (
            <Link
              href="/"
              className="btn ms-2"
              style={{ backgroundColor: "#3A506B", color: "#FFFFFF",fontSize: "1.15rem"  }}
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
