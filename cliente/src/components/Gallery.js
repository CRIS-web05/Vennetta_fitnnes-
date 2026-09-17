import { useState, useEffect } from "react";
import { getTranslation } from "../translations";
import "../styles/gallery.css";
import GlobalMap from "./GlobalMap";
import LazyVideo from "./LazyVideo";

// FOTOS GENERALES
import img1 from "../assets/IMG_7587.jpeg";
import img2 from "../assets/IMG_7605.jpeg";
import img3 from "../assets/IMG_7617.jpeg";
import img4 from "../assets/IMG_7625.jpeg";
import img5 from "../assets/IMG_7630.jpeg";
import img6 from "../assets/IMG_01.jpeg";
import img7 from "../assets/IMG_02.jpeg";
import img8 from "../assets/IMG_03.jpeg";
import img9 from "../assets/IMG_04.jpeg";
import img10 from "../assets/IMG_05.jpeg";
import img11 from "../assets/IMG_06.jpeg";
import img12 from "../assets/IMG_07.jpeg";
import img13 from "../assets/IMG_08.jpeg";
import img14 from "../assets/IMG_09.jpeg";

// VIDEOS GENERALES (MP4)
import vid1 from "../assets/VIDEO_01.mp4";
import vid2 from "../assets/VIDEO_02.mp4";
import vid3 from "../assets/VIDEO_03.mp4";
import vid4 from "../assets/VIDEO_04.mp4";
import mov1 from "../assets/IMG_5682.mp4";
import mov2 from "../assets/IMG_5685.mp4";
import mov3 from "../assets/IMG_5688.mp4";
import mov4 from "../assets/IMG_5690.mp4";
import mov5 from "../assets/IMG_5697.mp4";
import mov6 from "../assets/IMG_5702.mp4";
import mov7 from "../assets/IMG_5722.mp4";
import mov8 from "../assets/IMG_5733.mp4";
import mov9 from "../assets/IMG_5736.mp4";

// SALON FAMA
import fama1 from "../assets/SALON_FAMA01.jpeg";
import fama2 from "../assets/SALON_FAMA02.jpeg";
import fama3 from "../assets/SALON_FAMA03.jpeg";

const photoItems = [
  { src: img1, title: "DISCIPLINA EN ACCIÓN", text: "No es fácil… pero cada repetición te acerca a la mejor versión de ti mismo.", altDesc: "Atleta ejecutando press de banca con barra olímpica pesada demostrando técnica biomecánica de potencia y máxima concentración muscular." },
  { src: img2, title: "ENERGÍA SIN LÍMITES", text: "Cuando disfrutas el proceso, el esfuerzo se convierte en poder.", altDesc: "Atleta femenina realizando entrenamiento funcional de hombros y brazos con mancuernas en el área de pesas libres." },
  { src: img3, title: "ESPACIO PARA CRECER", text: "Todo gran cambio comienza en un lugar donde decides mejorar.", altDesc: "Panorama interior de las instalaciones de Vendetta Fitness destacando la zona de acondicionamiento físico, jaulas de powerlifting y poleas multifuncionales." },
  { src: img4, title: "EXPERIENCIA QUE INSPIRA", text: "Aprender de los mejores acelera tu camino al éxito.", altDesc: "Entrenador personal supervisando y ajustando la postura biomecánica de un deportista en la máquina de extensión de cuadriceps." },
  { src: img5, title: "COMPROMISO TOTAL", text: "La constancia convierte lo ordinario en resultados extraordinarios.", altDesc: "Deportista ejecutando sentadilla profunda en rack profesional de potencia con discos olímpicos de caucho." },
  { src: img6, title: "FUERZA EN EQUIPO", text: "Rodearte de personas que luchan como tú… te obliga a subir de nivel.", altDesc: "Grupo de atletas y deportistas de la academia posando juntos con entusiasmo y compañerismo tras finalizar una intensa rutina en equipo." },
  { src: img7, title: "INSPIRANDO DESDE PEQUEÑOS", text: "La disciplina que se aprende hoy, construye el carácter del mañana.", altDesc: "Alumno infantil del curso vacacional practicando patadas, equilibrio y coordinación física en el área de artes marciales." },
  { src: img8, title: "LOGROS QUE HABLAN", text: "Cada premio es el reflejo de horas de esfuerzo invisible.", altDesc: "Exhibición de trofeos de copa dorada, medallas de primer lugar y diplomas de honor obtenidos por competidores de Vendetta Fitness." },
  { src: img9, title: "RESULTADOS REALES", text: "No se trata de ser perfecto, se trata de ser mejor que ayer.", altDesc: "Registro de progreso físico y desarrollo muscular en el torso y zona abdominal de un atleta disciplinado." },
  { src: img10, title: "SUPERANDO LÍMITES", text: "La edad no define tu fuerza… tu actitud sí.", altDesc: "Atleta adulto mayor ejecutando ejercicio de fuerza de espalda en la máquina de jalón al pecho con agarre neutro." },
  { src: img11, title: "PREPARACIÓN DE CAMPEONES", text: "El esfuerzo de hoy es el orgullo de mañana.", altDesc: "Levantador de potencia preparando el agarre de magnesio sobre la barra olímpica antes de realizar un intento pesado de peso muerto." },
  { src: img12, title: "CONFIANZA EN ESCENAS", text: "Cuando trabajas en ti, la seguridad se vuelve natural.", altDesc: "Atleta de fisicoculturismo en posado de perfil sobre escenario deportivo exhibiendo definición muscular, simetría y tono corporal." },
  { src: img13, title: "ACTITUD GANADORA", text: "No solo entrenas el cuerpo… entrenas tu mentalidad.", altDesc: "Socio entrenando la capacidad cardiovascular y la resistencia muscular explosiva con cuerdas de batalla de alta intensidad." },
  { src: img14, title: "UN LUGAR PARA CRECER", text: "Aquí no solo se construyen músculos… se construyen historias de éxito.", altDesc: "Grupo de entrenamiento realizando sesión colectiva de estiramientos guiados y recuperación articular en colchonetas." }
];

const horizontalVideosArray = [
  { 
    src: vid1, 
    heading: "🔥 POWERLIFTING DE ALTO RENDIMIENTO 🔥",
    text: "Un entrenamiento de fuerza modo Powerlifting de uno de los Atletas de Alto Rendimiento de Vendetta Fitness: Luis Caiza, Campeón Nacional de Powerlifting en su categoría haciendo parecer 235 kilos como una bolsa de pan. Para llegar a aquello que parece imposible, se debe iniciar por el primer paso: desearlo de verdad!" 
  },
  { 
    src: vid2, 
    heading: "⚽ FORJANDO CAMPEONES ⚽",
    text: "Equipo de fútbol en ascenso a Categoría Profesional haciendo uso de nuestras instalaciones. ¡Los verdaderos Campeones, se forjan en Vendetta Fitness! 💪🏻" 
  },
  { 
    src: vid3, 
    heading: "🏆 ARTES MARCIALES Y ENTRENAMIENTO 🏆",
    text: "Curso vacacional de entrenamiento y artes marciales con apoyo de Sensei David Cucuyo Espinoza, un referente de las artes marciales en el Ecuador y multi campeón a nivel Nacional, Sudamericano, Panamericano y Mundial. ¡Cada niño y niña que se adhiere al entrenamiento, es una promesa para la nación! 🏆" 
  },
  { 
    src: vid4, 
    heading: "👑 RECUPERACIÓN Y EXPLOSIVIDAD 👑",
    text: "Futbolista profesional potenciando su velocidad y explosividad después de su fortalecimiento y recuperación post lesión. En el Alto Rendimiento no estás libre de alguna lesión en el deporte, pero con un correcto diagnóstico permitirán tratar la lesión y rehabilitar después a las articulaciones afectadas. 🥇" 
  },
];

const verticalVideos = [
  mov1, mov2, mov3, mov4, mov5, mov6, mov7, mov8, mov9
];

const famaItems = [
  { src: fama1, title: "Leyenda Vendetta", altDesc: "Campeón nacional de powerlifting en el podio recibiendo la medalla de oro luciendo la camiseta oficial de Vendetta Fitness." },
  { src: fama2, title: "Corazón de Campeón", altDesc: "Atleta de élite ejecutando un levantamiento de peso muerto histórico batiendo récord en la categoría absoluta con barra cargada al máximo." },
  { src: fama3, title: "Historia de Éxito", altDesc: "Placa dorada de reconocimiento institucional y trofeo entregado a la delegación de entrenadores y atletas de Vendetta Fitness." }
];

function Gallery({ selectedLanguage }){

  const locale = selectedLanguage?.code || "es";
  const t = getTranslation(locale, "gallery");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photoItems.length);
    }, 4500); // 4.5 segundos
    return () => clearInterval(interval);
  }, []);

return(

<section className="gallery" id="galeria">

  {/* 🔥 SALÓN DE LA FAMA  */}
  <div className="salon-fama-container">
    <div className="gallery-header">
      <h2 className="glitch-title gold-text">{t.fameTitle}</h2>
      <p className="creative-msg">{t.fameDesc}</p>
    </div>

    <div className="fama-grid">
      {famaItems.map((fama) => (
        <div key={fama.title} className="fama-card">
          <img src={fama.src} alt={fama.altDesc || `Fotografía del Salón de la Fama Vendetta Fitness: ${fama.title}`} loading="lazy" />
          <div className="fama-hover">
            <h3>{fama.title}</h3>
            <span className="star-icon">★</span>
          </div>
        </div>
      ))}
    </div>
  </div>

  <div className="gallery-header" style={{ marginTop: '80px' }}>
    <h2 className="glitch-title">{t.installationsTitle}</h2>
    <p className="creative-msg">{t.installationsDesc}</p>
  </div>

  {/* 🔥 CARRUSEL DE FOTOS PREMIUM */}
  <div className="carousel-main-container">
    {photoItems.map((item, index) => (
      <div
        key={item.title}
        className={`carousel-bg-slide ${index === currentIndex ? "active" : ""}`}
        style={{ backgroundImage: `url(${item.src})` }}
      >
        <div className="carousel-dark-overlay">
          <div className="carousel-text-content">
            <h3 className="carousel-glow-title">{item.title}</h3>
            <p className="carousel-desc">{item.text}</p>
          </div>
        </div>
      </div>
    ))}

    <div className="carousel-indicators">
      {photoItems.map((item, index) => (
        <span 
          key={`indicator-${item.title}`} 
          className={`indi-dot ${index === currentIndex ? "active" : ""}`}
          onClick={() => setCurrentIndex(index)}
        ></span>
      ))}
    </div>
  </div>

  {/* 🔥 TODAS LAS FOTOS EN GRILLA ESTÁTICA */}
  <div className="gallery-header" style={{ marginTop: '60px', marginBottom: '30px' }}>
    <h2 className="glitch-title">{t.photosTitle}</h2>
  </div>
  <div className="static-photos-grid">
    {photoItems.map((item) => (
      <div key={item.title} className="static-photo-item" onClick={() => setSelectedImage(item.src)} style={{cursor: 'pointer'}}>
        <img src={item.src} alt={item.altDesc || `Fotografía oficial de Vendetta Fitness: ${item.title} - ${item.text}`} loading="lazy" />
      </div>
    ))}
  </div>

  {/* 🔥 VIDEOS (SEPARADOS) */}
  <div className="section-divider video-divider">
    <h2>{t.videoSectionTitle}</h2>
    <p>{t.videoSectionDesc}</p>
  </div>

  <h3 className="video-category-title">{t.featuredTitle}</h3>
  
  <div className="videos-grid vertical-videos">
    {verticalVideos.map((vid, i) => (
      <div key={vid} className="video-item v-vid" onClick={() => setSelectedVideo(vid)}>
        <LazyVideo 
          src={vid} 
          playsInline 
          preload="metadata" 
          title={`Video de entrenamiento de intensidad ${i + 1}`}
        />
        <div className="play-overlay">▶</div>
      </div>
    ))}
    
    <div className="fatme-showcase-box inline-fatme-box">
      <div className="fatme-glow"></div>
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
        <strong className="fatme-name" style={{ fontSize: '24px', marginBottom: '10px' }}>{t.fatmeName || "Fatme Merizalde"}</strong><br/>
        {t.fatmeRole || "Primera Atleta e Imagen de Vendetta Fitness (2021)."}<br/><br/>
        <span className="fatme-highlight" style={{ fontSize: '14px', marginTop: '5px' }}>{t.fatmeHighlight || "Campeona Nacional de Powerlifting y atleta de Culturismo categoría Wellness."}</span>
      </p>
    </div>
  </div>

  <h3 className="video-category-title">{t.featuredSubtitle}</h3>
  <div className="videos-grid horizontal-videos">
    {horizontalVideosArray.map((vidObj) => {
      return (
        <div key={vidObj.heading} className="video-item h-vid horizontal-card side-by-side-card" onClick={() => setSelectedVideo(vidObj.src)}>
          <div className="sbs-video-container">
            <LazyVideo src={vidObj.src} playsInline preload="metadata" title={vidObj.heading} />
            <div className="play-overlay">▶</div>
          </div>
          <div className="sbs-text-container">
            <div className="sbs-text-inner">
              <h4 className="sbs-heading">{vidObj.heading}</h4>
              <p className="sbs-description">{vidObj.text}</p>
            </div>
          </div>
        </div>
      );
    })}
  </div>

{/* 🔥 MAPA DIRECTO */}
<GlobalMap />

  {/* 🔥 MODAL PARA VIDEOS */}
  {selectedVideo && (
    <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        <button className="video-modal-close" onClick={() => setSelectedVideo(null)}>✖</button>
        <video src={selectedVideo} controls autoPlay playsInline aria-label="Video seleccionado en alta definición">
          <track kind="subtitles" srcLang="es" label="Español" default />
          <track kind="subtitles" srcLang="en" label="English" />
        </video>
      </div>
    </div>
  )}

  {/* 🔥 MODAL PARA FOTOS AMPLIADAS */}
  {selectedImage && (
    <div className="video-modal-overlay" onClick={() => setSelectedImage(null)} style={{ zIndex: 9999 }}>
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'transparent', boxShadow: 'none' }}>
        <button className="video-modal-close" onClick={() => setSelectedImage(null)} style={{ textShadow: '0 0 10px red' }}>✖</button>
        <img src={selectedImage} alt="Fotografía ampliada en alta definición de la galería oficial de Vendetta Fitness" style={{ width: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: '10px', boxShadow: '0 0 30px rgba(255,0,0,0.3)' }} />
      </div>
    </div>
  )}

</section>

)

}

export default Gallery;