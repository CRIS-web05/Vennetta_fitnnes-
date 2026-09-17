import { useState } from "react";
import "../styles/membresias.css";
import { getTranslation } from "../translations";
import Contact from "./Contact";
import entrenadorImg from "../assets/NUESTRO_ENTRENADOR.png";
import GlobalMap from "./GlobalMap";

function Membresias({ selectedLanguage }){

const [showModal, setShowModal] = useState(false);
const [selectedPlan, setSelectedPlan] = useState("");
const locale = selectedLanguage?.code || "es";
const t = getTranslation(locale, "membresias");

const abrirContacto = (planName = "") => {
  setSelectedPlan(planName);
  setShowModal(true);
};

return(

<section className="planes" id="planes">

<h2>{t.title}</h2>

<div className="plan-cards">

{/* DIARIO */}
<div className="plan" onClick={() => abrirContacto("Diario")} style={{ cursor: 'pointer' }}>
<h3>{t.diarioTitle || "Diario"}</h3>
<p className="price">{t.diarioPrice || "Acceso único"}</p>
<p>{t.diario1 || "Entrena sin inscripción"}</p>
<p>{t.diario2 || "Uso ilimitado del gym en el día"}</p>
<p>{t.diario3 || "Asesoría Vendetta incluida"}</p>

<button onClick={(e) => { e.stopPropagation(); abrirContacto("Diario"); }}>
{t.planButton}
</button>
</div>

{/* JABA */}
<div className="plan featured" onClick={() => abrirContacto("JABA")} style={{ cursor: 'pointer' }}>
<h3>{t.jabaTitle || "JABA"}</h3>
<p className="price">{t.jabaPrice || "Entrena a tu ritmo"}</p>
<p>{t.jaba1 || "Ideal para personas que asisten esporádicamente"}</p>
<p>{t.jaba2 || "y no caduca hasta que completes las 12 sesiones."}</p>


<button onClick={(e) => { e.stopPropagation(); abrirContacto("JABA"); }}>
{t.planButton}
</button>
</div>

{/* MENSUAL */}
<div className="plan" onClick={() => abrirContacto("Mensual")} style={{ cursor: 'pointer' }}>
<h3>{t.mensualTitle || "Mensual"}</h3>
<p className="price">{t.mensualPrice || "Full acceso"}</p>
<p>{t.mensual1 || "Entrena todos los días"}</p>
<p>{t.mensual2 || "Rutina + nutrición incluida"}</p>
<p>{t.mensual3 || "Resultados garantizados"}</p>

<button onClick={(e) => { e.stopPropagation(); abrirContacto("Mensual"); }}>
{t.planButton}
</button>
</div>

{/* TRIMESTRE */}
<div className="plan" onClick={() => abrirContacto("Trimestre")} style={{ cursor: 'pointer' }}>
<h3>{t.trimestreTitle || "Trimestre"}</h3>
<p className="price">{t.trimestrePrice || "3 meses"}</p>
<p>{t.trimestre1 || "Todo lo de la membresía mensual"}</p>
<p>{t.trimestre2 || "Bioimpedancia gratis"}</p>
<p>{t.trimestre3 || "Seguimiento de progreso"}</p>

<button onClick={(e) => { e.stopPropagation(); abrirContacto("Trimestre"); }}>
{t.planButton}
</button>
</div>

{/* ANUAL */}
<div className="plan" onClick={() => abrirContacto("Anual")} style={{ cursor: 'pointer' }}>
<h3>{t.anualTitle || "Anual"}</h3>
<p className="price">{t.anualPrice || "Acceso ilimitado"}</p>
<p>{t.anual1 || "Mismos beneficios a un mejor precio!"}</p>
<p>{t.anual2 || "Evaluación corporal cada 8 semanas"}</p>

<button onClick={(e) => { e.stopPropagation(); abrirContacto("Anual"); }}>
{t.planButton}
</button>
</div>

</div>

{/* 🔥 INFORMACIÓN IMPORTANTE */}
<div className="info-box">
<h3>{t.infoTitle}</h3>
<p>{t.infoText}</p>
</div>

{/* 🔥 ENTRENADORES */}
<div className="trainers-mini">

<h2>{t.trainerTitle}</h2>

<div className="trainers-container">

<div className="trainer-card">

  <div className="trainer-image-container">
    <img src={entrenadorImg} alt="Fotografía profesional en plano medio de Marlon Eduardo Arias v., CEO y Entrenador Principal de Vendetta Fitness, vistiendo la indumentaria oficial del club e indicando su especialidad en preparación física" />
  </div>

  <div className="trainer-info">
    <h4>Marlon Eduardo Arias v.</h4>
    <p className="trainer-role">{t.trainerRole || "CEO Y ENTRENADOR PRINCIPAL"}</p>
    
    <div className="trainer-bio-premium">
      <p className="bio-highlight">
        {t.trainerBioHighlight || "Especialista en Entrenamiento avanzado, Acondicionamiento Físico, Nutrición Deportiva, Suplementación y Farmacología."}
      </p>

      <p className="bio-history">
        {t.trainerBioHistory || "Atleta y deportista (fútbol, cheerleading, etc) en el período estudiantil en la Escuela Politécnica Nacional (2008-2018), posterior a ello empieza sus Certificaciones para ser Entrenador Personal y Preparador Físico."}
      </p>

      <h5 className="cert-title">{t.certTitle || "🎖️ Certificaciones y Diplomados Destacados:"}</h5>
      <ul className="cert-list">
        <li><strong>Entrenamiento Estético y Nutrición Deportiva</strong> <br/><span>(CADEX México)</span></li>
        <li><strong>Preparación Física, Suplementación y Ayudas Ergogénicas</strong> <br/><span>(Ministerio de Trabajo Ecuador)</span></li>
        <li><strong>Especialista en Fitness</strong> <br/><span>(ESPE - CEC Ecuador)</span></li>
        <li><strong>Personal Trainer</strong> <br/><span>(IFBB Internacional)</span></li>
        <li><strong>Especialista en Entrenamiento de Glúteos</strong> <br/><span>(CSFF Ecuador)</span></li>
        <li><strong>Entrenador de Futbolistas Amateur</strong> <br/><span>(Coach Group Ecuador)</span></li>
        <li><strong>Fitness de Combate</strong> <br/><span>(Samurai Fight, Ecuador)</span></li>
        <li><strong>Fisioterapia y Medicina Deportiva</strong> <br/><span>(COFIT 2026, Colombia)</span></li>
        <li><strong>Entrenador a Personas con Discapacidad</strong> <br/><span>(UCE, Ecuador)</span></li>
      </ul>
    </div>
  </div>

</div>

</div>

</div>

{/* 🔥 MAPA DIRECTO */}
<GlobalMap />

  {/* 🔥 MODAL FLOTANTE */}
  {showModal && (
    <div className="membresia-modal-overlay" onClick={() => setShowModal(false)}>
      <div className="membresia-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={() => setShowModal(false)}>✖</button>
        <Contact isModal={true} selectedLanguage={selectedLanguage} defaultPlan={selectedPlan} />
      </div>
    </div>
  )}

</section>

)

}

export default Membresias;