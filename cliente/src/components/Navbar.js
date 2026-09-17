import { useState, useEffect } from "react";
import "../styles/navbar.css";
import logo from "../assets/logo-dark.png";
import { Link } from "react-router-dom";
import { getTranslation } from "../translations";
import { isStaff } from "../utils/auth";

function Navbar({ onLogout, selectedLanguage, user }){

const locale = selectedLanguage?.code || "es";
const t = getTranslation(locale, "nav");
const fullTranslationObj = getTranslation(locale);
const mensajes = fullTranslationObj.navbarMessages || [
  "VENDETTA FITNESS",
  "SIN ESFUERZO NO HAY GANANCIA",
  "TE VA A DOLER PERO TE VA A GUSTAR",
  "DISCIPLINA • CONSTANCIA • RESULTADOS",
  "ENTRENA COMO UN CAMPEÓN",
  "EL DOLOR ES TEMPORAL, EL BENEFICIO ES PARA SIEMPRE!",
  "CONSTRUYE TU MEJOR VERSIÓN",
  "POWER • STRENGTH • DISCIPLINE",
  "EL PROGRESO NO SE DETIENE",
  "MÁS FUERTE CADA DÍA",
];

const [index,setIndex] = useState(0);
const staffUser = isStaff();

useEffect(()=>{

const intervalo = setInterval(()=>{
setIndex((prev)=>(prev+1)%mensajes.length);
},3000);

return ()=>clearInterval(intervalo);

},[mensajes.length]);

return(

<nav className="navbar" aria-label="Main navigation">

  {/* 🔥 LOGO IZQUIERDO */}
  <img src={logo} alt="Emblema e insignia oficial de Vendetta Fitness Industry con calavera de poder, barras cruzadas y contrastes en rojo neón, blanco y negro" className="nav-logo left" />

  {/* 🔥 TEXTO LED */}
  <h1 className="led-text">
    {mensajes[index] === "VENDETTA FITNESS" ? (
      <>
        <span className="led-red">VENDETTA </span>
        <span className="led-white">FITNESS</span>
      </>
    ) : (
      <span className="led-white">{mensajes[index]}</span>
    )}
  </h1>

  {/* 🔥 MENÚ */}
  <ul className="nav-links">
    {staffUser ? (
      <>
        <li>
          <Link to="/emprendedores" className="nav-btn">{t.emprendedores || "EMPRENDEDORES"}</Link>
        </li>
        <li>
          <Link to="/admin" className="nav-btn">{t.panel || "PANEL"}</Link>
        </li>
        <li>
          <Link to="/dashboard" className="nav-btn">DASHBOARD</Link>
        </li>
        <li>
          <Link to="/profile" className="nav-btn">{t.profile || "PERFIL"}</Link>
        </li>
        <li>
          <button onClick={onLogout} className="nav-btn logout-btn">{t.logout}</button>
        </li>
      </>
    ) : (
      <>
        <li>
          <Link to="/" className="nav-btn">{t.inicio}</Link>
        </li>
        <li>
          <Link to="/membresias" className="nav-btn">{t.membresias}</Link>
        </li>
        <li>
          <Link to="/rutinas" className="nav-btn">{t.rutinas || "RUTINAS"}</Link>
        </li>
        <li>
          <Link to="/galeria" className="nav-btn">{t.galeria}</Link>
        </li>
        <li>
          <Link to="/profile" className="nav-btn">{t.profile || "PERFIL"}</Link>
        </li>
        <li>
          <button onClick={onLogout} className="nav-btn logout-btn">{t.logout}</button>
        </li>
      </>
    )}
  </ul>

  {/* 🔥 LOGO DERECHO */}
  <img src={logo} alt="Emblema e insignia oficial de Vendetta Fitness Industry con calavera de poder, barras cruzadas y contrastes en rojo neón, blanco y negro" className="nav-logo right" />

</nav>

)

}

export default Navbar;