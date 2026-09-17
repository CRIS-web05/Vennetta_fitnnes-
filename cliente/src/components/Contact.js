import { FaWhatsapp, FaMapMarkerAlt, FaDumbbell } from "react-icons/fa";
import { getTranslation } from "../translations";
import "../styles/contact.css";

const PLAN_OPTIONS = ["Diario", "JABA", "Mensual", "Trimestre", "Anual"];

function Contact({ selectedLanguage, isModal = false, defaultPlan = "" }){

const locale = selectedLanguage?.code || "es";
const t = getTranslation(locale, "contact");

const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const nombre = formData.get("nombre");
  const telefono = formData.get("telefono");
  const mensaje = formData.get("mensaje");
  const plan = formData.get("plan");

  const numeroWhatsApp = "593987729737"; 

  let textoMensaje = `¡Hola, Vendetta Fitness! 🔥\n\n💪 Mi nombre es *${nombre}*.\n📱 Mi teléfono de contacto es *${telefono}*.\n\n🎯 Estoy interesado en el plan *${plan}*.\n\n💬 ${mensaje}`;

  const mensajeCodificado = encodeURIComponent(textoMensaje);
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  const baseUrl = isMobile 
    ? "https://api.whatsapp.com/send" 
    : "https://web.whatsapp.com/send";
  
  const urlWhatsApp = `${baseUrl}?phone=${numeroWhatsApp}&text=${mensajeCodificado}`;

  window.open(urlWhatsApp, "_blank");

  e.target.reset();
};

return(
<section className={`contact-section ${isModal ? "modal-mode" : ""}`} id="contacto">
  
  <div className="contact-wrapper">
    
    {!isModal && (
      <div className="contact-info">
        <h2 className="info-title">{t.infoTitle}</h2>
        <p className="info-desc">{t.infoDesc}</p>
        
        <div className="info-details">
          <div className="info-item">
            <FaDumbbell className="info-icon" />
            <span>{t.item1}</span>
          </div>
          <div className="info-item">
            <FaMapMarkerAlt className="info-icon" />
            <span>{t.item2}</span>
          </div>
          <div className="info-item">
            <FaWhatsapp className="info-icon" />
            <span>{t.item3}</span>
          </div>
        </div>
      </div>
    )}

    <div className="contact-card">
      <h2>{isModal ? t.modalTitle : t.formTitle}</h2>
      
      <form onSubmit={handleSubmit} autoComplete="off">
        
        <div className="input-group">
          <select required name="plan" id="plan" key={defaultPlan} defaultValue={defaultPlan || ""}>
            <option value="" disabled>{t.planPlaceholder}</option>
            {PLAN_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <label>{t.planLabel}</label>
        </div>

        <div className="row-group">
          <div className="input-group">
            <input type="text" required name="nombre" id="nombre" placeholder=" "/>
            <label>{t.nameLabel}</label>
          </div>
          
          <div className="input-group">
            <input type="text" required name="telefono" id="telefono" placeholder=" "/>
            <label>{t.phoneLabel}</label>
          </div>
        </div>

        <div className="input-group">
          <textarea required name="mensaje" id="mensaje" placeholder=" "></textarea>
          <label>{t.helpLabel}</label>
        </div>

        <button className="contact-btn whatsapp-btn" type="submit">
          <FaWhatsapp className="whatsapp-icon" /> {t.submitBtn}
        </button>

      </form>
    </div>
  </div>

</section>
)
}

export default Contact;