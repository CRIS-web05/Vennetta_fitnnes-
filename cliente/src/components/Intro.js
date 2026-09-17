import { useEffect, useState } from "react";
import "../styles/intro.css";

// ✅ SOLO UN LOGO
import logo from "../assets/logo-dark.png";

function Intro({ onFinish }){

const [hide, setHide] = useState(false);

useEffect(() => {

  const t1 = setTimeout(() => {
    setHide(true);
  }, 2500);

  const t2 = setTimeout(() => {
    onFinish();
  }, 3300);

  return () => {
    clearTimeout(t1);
    clearTimeout(t2);
  };

}, [onFinish]);

return(

<div className={`intro ${hide ? "hide" : ""}`}>

  <img 
    src={logo} 
    alt="Logotipo e insignia animada de apertura de Vendetta Fitness Industry con destellos neón y calavera de poder" 
    className="intro-logo"
  />

</div>

)

}

export default Intro;