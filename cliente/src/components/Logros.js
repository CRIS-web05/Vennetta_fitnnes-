import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import translations from "../translations";
import "../styles/logros.css";

import videoGym from "../assets/video-gym.mp4";
import embajador from "../assets/embajador.jpeg";
import GlobalMap from "./GlobalMap";

function Logros({ selectedLanguage }){

const navigate = useNavigate();
const locale = selectedLanguage?.code || "es";
const t = translations[locale]?.logros || translations.en.logros || translations.es.logros;
const videoRef = useRef(null);
const [playing, setPlaying] = useState(false);

// 🔥 TEMPORIZADOR
const [tiempo, setTiempo] = useState({dias:0, horas:0, minutos:0, segundos:0});

// 🔥 FECHA COFIT (2026-04-24)
useEffect(() => {

  const fechaEvento = new Date("2026-04-24T00:00:00");

  const intervalo = setInterval(() => {

    const ahora = new Date();
    const diferencia = fechaEvento - ahora;

    if(diferencia <= 0){
      clearInterval(intervalo);
      return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
    const segundos = Math.floor((diferencia / 1000) % 60);

    setTiempo({dias, horas, minutos, segundos});

  },1000);

  return ()=> clearInterval(intervalo);

},[]);

// 🔥 PLAY VIDEO
const reproducirVideo = () => {
  if(videoRef.current){
    videoRef.current.muted = false;
    videoRef.current.play();
    setPlaying(true);
  }
};

return(

<section className="logros" id="logros">

  {/* 🔥 CONTADOR ARRIBA RECTO */}
  <div className="logros-top">
    <h3 className="conteo-title">⏳ CONTEO REGRESIVO ⏳</h3>
    <div className="timer recto">
      <div><span>{tiempo.dias}</span><p>D</p></div>
      <div className="divider">:</div>
      <div><span>{tiempo.horas}</span><p>H</p></div>
      <div className="divider">:</div>
      <div><span>{tiempo.minutos}</span><p>M</p></div>
      <div className="divider">:</div>
      <div><span>{tiempo.segundos}</span><p>S</p></div>
    </div>
  </div>

  {/* 🔥 CONTENIDO Y TEXTOS */}
  <div className="logros-header">
    <h2 className="title-red">{t.title}</h2>
    <p className="text-cofit-promo">
      {t.promoText}
    </p>
  </div>

  {/* 🔥 MEDIA (FOTO Y VIDEO CENTRADOS) */}
  <div className="logros-media-grid">

    {/* VIDEO */}
    <div className="media-item">
      <div className="video-wrapper" style={{ position: 'relative' }}>
        <video
          ref={videoRef}
          src={videoGym}
          playsInline
          controls={playing}
          aria-label="Video del atleta Marlon Eduardo Arias entrenando para COFIT 2026"
        >
          <track kind="subtitles" srcLang="es" label="Español" default />
          <track kind="subtitles" srcLang="en" label="English" />
        </video>
        {!playing && (
          <div className="play-btn-pro" onClick={reproducirVideo}>
            ▶
          </div>
        )}
      </div>
    </div>

    {/* FOTO */}
    <div className="media-item">
      <div className="img-wrapper">
        <img src={embajador} alt="Fotografía oficial de gala deportiva de Marlon Eduardo Arias v., representando a Ecuador como Embajador oficial en el evento internacional COFIT 2026 en Cartagena de Indias, Colombia" className="logros-img-pro" />
      </div>
    </div>

  </div>

{/* 🔥 MAPA DIRECTO */}
<GlobalMap />

</section>

)

}

export default Logros;