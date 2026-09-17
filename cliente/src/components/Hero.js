import { useState, useRef, useEffect } from "react";
import "../styles/hero.css";
import "../styles/logros.css"; // Importar estilos de Logros
import { getTranslation } from "../translations";
import { getSubtitlesForVideo } from "../data/subtitles";
import heroVideo from "../assets/VIDEO.mov";

import videoGym from "../assets/video-gym.mp4";
import embajador from "../assets/embajador.jpeg";
import GlobalMap from "./GlobalMap";
import imgGym from "../assets/GYM_INDUSTRY.jpeg";
import imgPrep from "../assets/PREPARACION_GYM.jpeg";
import imgCert from "../assets/INAGURACION_IMG03.jpeg";
import imgRemoto from "../assets/ENTRENAMIENTO_REMOTO01.jpeg";
import imgFranquicia from "../assets/FRANQUICIA_GYM.jpeg";
import imgMarca from "../assets/MARCA.jpeg";

function Hero({ selectedLanguage }){

  const locale = selectedLanguage?.code || "es";
  const t = getTranslation(locale, "hero");
  const brandStatement = t.brandStatement || "Documento oficial de Vendetta Fitness Industry marca registrada";
  const heroSubtitles = getSubtitlesForVideo("hero", locale);
  const gymSubtitles = getSubtitlesForVideo("recovery", locale);

  const services = [
    { title: t.service1Title, desc: t.service1Desc, img: imgGym, altDesc: "Vista completa de las instalaciones del gimnasio de musculación equipado con racks de potencia, mancuernas de alto tonelaje y prensas de piernas de ángulo biomecánico" },
    { title: t.service2Title, desc: t.service2Desc, img: imgPrep, altDesc: "Atleta en sesión individual de preparación física y reacondicionamiento muscular supervisada paso a paso por un preparador físico certificado" },
    { title: t.service3Title, desc: t.service3Desc, img: imgCert, altDesc: "Ceremonia oficial de entrega de diplomados internacionales y certificaciones académicas en ciencias aplicadas al deporte y nutrición deportiva" },
    { title: t.service4Title, desc: t.service4Desc, img: imgRemoto, altDesc: "Interfaz digital del programa de coaching remoto mostrando plan de entrenamiento personalizado, guía de macronutrientes y módulo de consultas online" },
    { title: t.service5Title, desc: t.service5Desc, img: imgFranquicia, altDesc: "Modelo arquitectónico y comercial de la franquicia Vendetta Fitness con áreas optimizadas de pesas, cardio, recepción y vestidores" },
  ];

  const [isMuted, setIsMuted] = useState(true);

  // 🔥 LÓGICA DE LOGROS (MOMENTOS VENDETTA)
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [tiempo, setTiempo] = useState({dias:0, horas:0, minutos:0, segundos:0});
  const [timerTerminado, setTimerTerminado] = useState(() => new Date() >= new Date("2026-04-24T00:00:00"));
  const [selectedImage, setSelectedImage] = useState(null);
  
  const [showMision, setShowMision] = useState(false);
  const [showVision, setShowVision] = useState(false);

  useEffect(() => {
    const fechaEvento = new Date("2026-04-24T00:00:00");
    const intervalo = setInterval(() => {
      const ahora = new Date();
      const diferencia = fechaEvento - ahora;
      if(diferencia <= 0){
        setTimerTerminado(true);
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

  const reproducirVideo = () => {
    if(videoRef.current){
      videoRef.current.muted = false;
      videoRef.current.play();
      setPlaying(true);
    }
  };

return(

<section className="hero" id="inicio">

  {/* 🔥 BLOQUE VISUAL (SPLIT LAYOUT) */}
  <div className="hero-top">
    
    {/* 🔥 LADO IZQUIERDO: TEXTOS SOBRE NEGRO */}
    <div className="hero-content">
      <h1 className="hero-title">
        <span className="hero-vendetta-red">VENDETTA</span>
        <span className="hero-fitness-white">FITNESS</span>
      </h1>
      <h2 className="hero-subtitle" style={{ color: 'white', textShadow: '0 0 10px rgba(255,0,0,0.8)' }}>
        {t.subtitle1}
      </h2>
      <h2 className="hero-subtitle" style={{ fontSize: '28px', marginTop: '15px' }}>
        {t.subtitle2}
      </h2>
      <p className="hero-description">
        {t.description}
      </p>
      <div className="mv-cards-container">
        
        <div className={`mv-interactive-card ${showMision ? 'open' : ''}`} onClick={() => setShowMision(!showMision)}>
          <div className="mv-card-header">
            <h3>{t.misionTitle || "📜 Misión"}</h3>
            <span className="mv-icon">{showMision ? '▲' : '▼'}</span>
          </div>
          <div className={`mv-card-body ${showMision ? 'show' : ''}`}>
            <p>
              {t.misionText1 || "Transformar vidas mediante el entrenamiento."}
            </p>
            <p>
              {t.misionText2 || "Cargar pesos es la analogía perfecta de la vida, cuando lo entiendas, ya estarás más fuerte, más resiliente, con mejor físico, mayor autoestima y tomando mejores decisiones. Si, es posible y se logra con entrenamiento Vendetta."}
            </p>
          </div>
        </div>

        <div className={`mv-interactive-card ${showVision ? 'open' : ''}`} onClick={() => setShowVision(!showVision)}>
          <div className="mv-card-header">
            <h3>{t.visionTitle || "🌍 Visión"}</h3>
            <span className="mv-icon">{showVision ? '▲' : '▼'}</span>
          </div>
          <div className={`mv-card-body ${showVision ? 'show' : ''}`}>
            <p>
              {t.visionText || "Somos la primera Marca de Entrenamiento en Ecuador. Talento Nacional de exportación para todo el planeta. Pero seremos una filosofía, un legado en todo el Territorio Nacional y fuera de él. Vendetta Fitness abarcará todo el Ecuador con su metodología propia que garantiza resultados en diferentes ejes."}
            </p>
          </div>
        </div>

      </div>

      <p className="hero-call-to-action">
        {t.callToAction}
      </p>
    </div>

    {/* 🔥 LADO DERECHO: VIDEO Y MARCA PEQUEÑA */}
    <div style={{ flex: 1, minWidth: '320px', maxWidth: '750px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      
      {/* VIDEO ORIGINAL (MANTIENE SUS CLASES) */}
      <div className="hero-video-container" style={{ width: '100%', position: 'relative' }}>
        <video 
          src={heroVideo} 
          autoPlay 
          loop 
          muted={isMuted} 
          playsInline 
          aria-label="Video principal de presentación de la intensidad de entrenamiento en Vendetta Fitness"
          className="hero-video-bg"
        >
          <track kind="subtitles" srcLang="es" label="Español" default />
          <track kind="subtitles" srcLang="en" label="English" />
        </video>
        <button className="mute-btn" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? (t.soundOff || "🔇 Activar Sonido") : (t.soundOn || "🔊 Silenciar")}
        </button>
        <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.85)', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', zIndex: 4, pointerEvents: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
          💬 CC: {heroSubtitles}
        </div>
      </div>

      {/* TÍTULO Y MARCA CENTRADOS */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px' }}>
        <h4 style={{ color: '#ccc', margin: 0, fontSize: '18px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>
          {brandStatement}
        </h4>
        <div className="hero-marca-small" onClick={() => setSelectedImage(imgMarca)} style={{ cursor: 'pointer', maxWidth: '240px', borderRadius: '10px', overflow: 'hidden', border: '2px solid rgba(255,0,0,0.4)', boxShadow: '0 0 15px rgba(255,0,0,0.2)', transition: 'transform 0.3s' }}>
          <img src={imgMarca} alt="Documento oficial del Certificado de Registro de Marca de Vendetta Fitness Industry en el Instituto de Propiedad Intelectual" style={{ width: '100%', height: 'auto', display: 'block' }} />
          <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.8)', padding: '8px', fontSize: '14px', color: 'white', fontWeight: 'bold', letterSpacing: '1px' }}>{t.zoomImage || "🔍 Ampliar"}</div>
        </div>
      </div>

    </div>

  </div>

{/* 🔥 SERVICIOS */}
<div className="hero-bottom">

  <h2>{t.servicesTitle}</h2>

  <div className="servicios-cards-container">

    {services.map((service, index) => (
      <div key={index} className="servicio-card-hero">
        <h3>{service.title}</h3>
        <p>{service.desc}</p>

        <div 
          className="img-wrapper-servicio"
          onClick={() => setSelectedImage(service.img)}
        >
          <img 
            src={service.img} 
            alt={service.altDesc || `Fotografía representativa del servicio ${service.title} de Vendetta Fitness`}
            className="servicio-img"
          />
        </div>

      </div>
    ))}

  </div>

</div> {/* AQUÍ TERMINA HERO-BOTTOM */}


  {/* 🔥 SECCIÓN DE LOGROS (MOMENTOS VENDETTA) AÑADIDA AQUÍ */}
  <div className="logros-section-in-hero" id="logros" style={{ padding: '80px 5%', background: '#0a0a0a', borderTop: '1px solid rgba(255, 0, 0, 0.2)' }}>
    
    {/* CONTADOR */}
    {!timerTerminado && (
      <div className="logros-top" style={{ marginBottom: '60px' }}>
        <h3 className="conteo-title">{t.countdownTitle || "⏳ CONTEO REGRESIVO ⏳"}</h3>
        <div className="timer recto">
          <div><span>{tiempo.dias}</span><p>{t.daysShort || "D"}</p></div>
          <div className="divider">:</div>
          <div><span>{tiempo.horas}</span><p>{t.hoursShort || "H"}</p></div>
          <div className="divider">:</div>
          <div><span>{tiempo.minutos}</span><p>{t.minsShort || "M"}</p></div>
          <div className="divider">:</div>
          <div><span>{tiempo.segundos}</span><p>{t.secsShort || "S"}</p></div>
        </div>
      </div>
    )}

    {/* TEXTOS LOGRO DISEÑO IMPACTANTE Y LLAMATIVO */}
    <div className="logros-header" style={{ textAlign: 'center', marginBottom: '70px', maxWidth: '1000px', margin: '0 auto 70px auto', position: 'relative', padding: '0 15px' }}>
      
      <div className="logro-box-premium">
        
        <div className="logro-destello"></div>

        <h2 className="title-red logro-title">
          {t.logrosTitle || "⭐ LOGROS INTERNACIONAL ⭐"}
        </h2>
        
        <p className="logro-subtitle">
          <strong style={{ fontSize: '32px', color: '#ccc', textShadow: '0 0 10px rgba(255,0,0,0.5)' }}>{t.logrosSub1 || "Eduardo Arias"}</strong><br/>
          <span style={{ fontSize: '20px', color: '#aaa' }}>{t.logrosSub2 || "CEO de Vendetta Fitness®"}</span><br/>
          <span className="logro-badge">
            {t.logrosBadge || "🏆 Embajador de Ecuador, presente en el COFIT 2026 en Cartagena-Colombia. 🏆"}
          </span>
        </p>

        <p className="logro-text-desc">
          {t.logrosDesc || "Un hito sin precedentes motivado por su gran trayectoria, preparación académica y los grandes resultados obtenidos a lo largo de su impresionante carrera como Preparador Físico."}
        </p>

        <div className="logro-quote">
          <p>
            {t.logrosQuote || "\"Es el primer ecuatoriano en asistir al COFIT en calidad de Embajador, representando con honor a nuestro país en este evento que reúne a los mejores profesionales del Entrenamiento, Medicina Deportiva y Fisioterapia.\""}
          </p>
        </div>
      </div>
      
    </div>

    {/* FOTO Y VIDEO */}
    <div className="logros-media-grid">
      <div className="media-item">
        <div className="video-wrapper" style={{ position: 'relative' }}>
          <video
            ref={videoRef}
            src={videoGym}
            playsInline
            controls={playing}
            aria-label="Video del entrenamiento de alta exigencia y recuperación deportiva de los atletas de Vendetta Fitness"
          >
            <track kind="subtitles" srcLang="es" label="Español" default />
            <track kind="subtitles" srcLang="en" label="English" />
          </video>
          {!playing && (
            <div className="play-btn-pro" onClick={reproducirVideo}>
              ▶
            </div>
          )}
          <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.85)', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', zIndex: 4, pointerEvents: 'none' }}>
            💬 CC: {gymSubtitles}
          </div>
        </div>
      </div>

      <div className="media-item">
        <div className="img-wrapper">
          <img src={embajador} alt="Marlon Eduardo Arias, CEO de Vendetta Fitness y Embajador oficial de Ecuador en el evento internacional COFIT 2026 en Cartagena, Colombia" className="logros-img-pro" />
        </div>
      </div>
    </div>
  </div>

  {/* 🔥 UBICACIÓN (VUELVE A FONDO NEGRO) */}
  <GlobalMap />

  {/* 🔥 MODAL PARA FOTOS AMPLIADAS HERO */}
  {selectedImage && (
    <div className="hero-modal-overlay" onClick={() => setSelectedImage(null)}>
      <div className="hero-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="hero-modal-close" onClick={() => setSelectedImage(null)}>✖</button>
        <img src={selectedImage} alt="Fotografía en alta resolución ampliada de las instalaciones y entrenamientos de Vendetta Fitness" className="hero-modal-img" />
      </div>
    </div>
  )}

</section>
  );
}

export default Hero;