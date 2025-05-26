"use client";

import CrudProducto from "@/app/CrudProducto/CrudProducto.js";
import CrudSupermercado from "@/app/CrudSupermercado/CrudSupermercado.js"
import CrudUser from "@/app/CrudUser/CrudUser.js"
import CrudProductoSupermercado from "@/app/CrudProductoSupermercado/CrudProductoSupermercado.js"
import InicioSesion from "@/app/InicioSesion/InicioSesion.js"
import CrudRole from "@/app/CrudRole/CrudRole.js"

export default function Home() {
  return (
    <main>
      {/*<CrudProducto/>
      <CrudSupermercado />
      <CrudUser />
      <CrudProductoSupermercado />*/}
      <InicioSesion />
      <CrudRole/>
      
    </main>
  );
}
