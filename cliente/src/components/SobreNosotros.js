import React, { useState } from 'react';
import { getTranslation } from '../translations';
import { getSubtitlesForVideo } from '../data/subtitles';
import '../styles/sobre-nosotros.css';
import GlobalMap from './GlobalMap';
import LazyVideo from './LazyVideo';

import imgInag1 from '../assets/INAGURACION_IMG01.jpeg';
import imgInag2 from '../assets/INAGURACION_IMG02.jpeg';
import imgInag3 from '../assets/INAGURACION_IMG03.jpeg';
import imgInag4 from '../assets/INAGURACION_IMG04.jpeg';
import imgInag5 from '../assets/INAGURACION_IMG05.jpeg';
import imgInag6 from '../assets/INAGURACION_IMG06.jpeg';
import vidInag1 from '../assets/INAGURACION_VID01.mp4';

import imgFest1 from '../assets/FESTIVIDAD_IMG01.jpeg';
import imgFest2 from '../assets/FESTIVIDAD_IMG02.jpeg';
import imgFest3 from '../assets/FESTIVIDAD_IMG03.jpeg';
import imgFest4 from '../assets/FESTIVIDAD_IMG04.jpeg';
import imgFest5 from '../assets/FESTIVIDAD_IMG05.jpeg';
import img14 from "../assets/IMG_09.jpeg";
import vidFest1 from '../assets/FESTIVIDAD_01.mp4';

import imgTodo1 from '../assets/TODO_EMPEZO_IMG01.jpeg';
import vidTodo1 from '../assets/TODO_EMPEZO_VID01.mp4';

function SobreNosotros({ selectedLanguage }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const locale = selectedLanguage?.code || 'es';
  const t = getTranslation(locale, 'about');

  return (
    <section className="sobre-nosotros-page">
      <div className="sobre-hero">
        <h1 className="glitch-title">{t.heroTitle}</h1>
        <div className="creative-msg-container">
          <p className="creative-msg-lead">
            <span className="highlight-red">Vendetta Fitness</span> {t.heroLead}
          </p>
          <div className="creative-msg-body">
            <p>
              {t.heroBody1}
            </p>
            <p>
              {t.heroBody2 || "Ahí nació el deseo de aprender para encontrar el problema. Después de años como autodidacta, a la par con los estudios de ingeniería, rendí pruebas teóricas y prácticas para ingresar a trabajar como entrenador en una cadena de gimnasios..."}
            </p>
            <p>
              {t.heroBody3 || "Ahí empezó realmente esta idea y, después de años de trabajar para otros gimnasios, decidí crear Vendetta Fitness Marca Registrada ®️ (septiembre 2023)..."}
            </p>
            <p>
              {t.heroBody4 || "Desde ese día existe un lugar que es como la juguetería, porque nos divertimos mientras transformamos vidas!"}
            </p>
            <p>
              {t.heroBody5 || "En algunos años Vendetta Fitness estará en más provincias del país y será un legado para quienes disfrutamos del entrenamiento..."}
            </p>
            <p className="creative-msg-footer">
              {t.heroFooter || "\"FITNESS DE CALIDAD!\""}
            </p>
          </div>
        </div>
      </div>

      <div className="sobre-content">

        {/* COMO TODO EMPEZO */}
        <div className="sobre-section-premium">
          <div className="premium-header">
            <h2>{t.section1Title}</h2>
            <p>{t.section1Desc}</p>
          </div>
          <div className="premium-media-split">
             <div className="premium-photo-side">
                <img src={imgTodo1} alt="Fotografía histórica de los primeros entrenamientos de potencia y levantamiento de pesas en los inicios de Vendetta Fitness con atletas equipados con cinturones de fuerza y barras olímpicas" onClick={() => setSelectedImage(imgTodo1)} className="clickable-img" loading="lazy" />
             </div>
             <div className="premium-video-side">
                <LazyVideo 
                  src={vidTodo1} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  title="Video histórico de los inicios de Vendetta Fitness"
                  subtitleText={getSubtitlesForVideo("hero", locale)} 
                />
             </div>
          </div>
        </div>

        {/* INAUGURACION */}
        <div className="sobre-section-premium">
          <div className="premium-header">
            <h2>{t.section2Title}</h2>
            <p>{t.section2Desc}</p>
          </div>
          <div className="premium-media-split reverse-mobile">
             <div className="premium-photo-grid-inag">
                <img src={imgInag1} alt="Fotografía panorámica de la entrada principal y recepción decorada con arreglos rojos y negros durante el gran evento de inauguración oficial del gimnasio matriz el 6 de junio de 2025" onClick={() => setSelectedImage(imgInag1)} className="clickable-img" loading="lazy" />
                <img src={imgInag2} alt="Momento emotivo del corte oficial de la cinta inaugural roja por parte de los fundadores y entrenadores frente al área principal de musculación" onClick={() => setSelectedImage(imgInag2)} className="clickable-img" loading="lazy" />
                <img src={imgInag3} alt="Fotografía conmemorativa de los fundadores y familiares principales: Sra. Gladys v., Srta. Vivi A., Lic. Andrés v., e Ing. Tere A., celebrando con orgullo la apertura oficial de la sede matriz" onClick={() => setSelectedImage(imgInag3)} className="clickable-img" loading="lazy" />
                <img src={imgInag4} alt="Grupo de invitados especiales, socios fundadores y primeros clientes reunidos en el área de pesas libres compartiendo el brindis de bienvenida" onClick={() => setSelectedImage(imgInag4)} className="clickable-img" loading="lazy" />
                <img src={imgInag5} alt="Demostración y presentación oficial de las máquinas biomecánicas de última generación y áreas especializadas de musculación durante el recorrido inaugural" onClick={() => setSelectedImage(imgInag5)} className="clickable-img" loading="lazy" />
                <img src={imgInag6} alt="Bendición tradicional de las instalaciones y ambiente de celebración comunitaria entre atletas, familiares y equipo técnico de Vendetta Fitness" onClick={() => setSelectedImage(imgInag6)} className="clickable-img" loading="lazy" />
             </div>
             <div className="premium-video-side">
                <LazyVideo 
                  src={vidInag1} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  title="Video de la celebración de inauguración oficial de Vendetta Fitness"
                  subtitleText={getSubtitlesForVideo("inauguration", locale)} 
                />
             </div>
          </div>
        </div>

        {/* FESTIVIDAD */}
        <div className="sobre-section-premium">
          <div className="premium-header">
            <h2>{t.section3Title}</h2>
            <p>{t.section3Desc}</p>
          </div>
          <div className="premium-media-split">
             <div className="premium-photo-grid-2x2">
                <img src={imgFest1} alt="Celebración comunitaria de fin de año con atletas y socios participando en actividades de equipo y dinámicas deportivas" onClick={() => setSelectedImage(imgFest1)} className="clickable-img" loading="lazy" />
                <img src={imgFest2} alt="Atletas y entrenadores sonrientes exhibiendo trofeos de superación personal en el encuentro social anual de la academia" onClick={() => setSelectedImage(imgFest2)} className="clickable-img" loading="lazy" />
                <img src={imgFest3} alt="Fotografía grupal de la gran familia Vendetta Fitness vestida con camisetas oficiales del club en la sede matriz" onClick={() => setSelectedImage(imgFest3)} className="clickable-img" loading="lazy" />
                <img src={imgFest4} alt="Entrega de diplomas y placas de reconocimiento a miembros destacados por su constancia, disciplina y transformación física" onClick={() => setSelectedImage(imgFest4)} className="clickable-img" loading="lazy" />
                <img src={img14} alt="Sesión interactiva de entrenamiento funcional en equipo y ejercicios de estiramiento articular post-sesión" onClick={() => setSelectedImage(img14)} className="clickable-img" loading="lazy" />
                <img src={imgFest5} alt="Fiesta y conmemoración de los logros alcanzados por los deportistas compartiendo una cena saludable y reconocimientos" onClick={() => setSelectedImage(imgFest5)} className="clickable-img" loading="lazy" />
             </div>
             <div className="premium-video-side">
                <LazyVideo 
                  src={vidFest1} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  title="Video conmemorativo de la comunidad y festividades de Vendetta Fitness"
                  subtitleText={getSubtitlesForVideo("festividad", locale)} 
                />
             </div>
          </div>
        </div>

      </div>

    <GlobalMap />

    {/* MODAL PARA FOTOS */}
    {selectedImage && (
      <div className="photo-modal-overlay" onClick={() => setSelectedImage(null)}>
        <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="photo-modal-close" onClick={() => setSelectedImage(null)}>✖</button>
          <img src={selectedImage} alt="Fotografía en alta definición ampliada en pantalla completa mostrando los eventos e historia de Vendetta Fitness" className="expanded-photo" />
        </div>
      </div>
    )}

    </section>
  );
}

export default SobreNosotros;
