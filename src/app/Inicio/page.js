"use client";

import { useState } from "react";
import Navbar from "../../../components/Navbar.jsx";

import 'bootstrap/dist/css/bootstrap.min.css';

const Inicio = () => {

  console.log('Ancho del viewport:', window.innerWidth, 'px');
  console.log('Alto del viewport:', window.innerHeight, 'px');
  return(
    <>
        <Navbar/>
        <p>Holaaa</p>
    </>
  )
};

export default Inicio;
