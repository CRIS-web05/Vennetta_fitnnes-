import React, { useState } from "react";
import { FaRocket, FaBuilding, FaHandshake, FaChartLine, FaCheckCircle, FaPaperPlane, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "../styles/emprendedores.css";
import { getTranslation } from "../translations";

function EmprendedoresSection({ selectedLanguage }) {
  const locale = selectedLanguage?.code || "es";
  const t = getTranslation(locale, "emprendedores");

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    ciudad: "",
    inversion_estimada: "$20,000 - $50,000",
    mensaje: "",
  });
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg(null);

    try {
      const res = await fetch("http://localhost:5000/api/emprendedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setResponseMsg({ type: "success", text: t.successMsg || "¡Tu solicitud ha sido enviada con éxito! Nuestro equipo de expansión corporativa se pondrá en contacto contigo pronto." });
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          ciudad: "",
          inversion_estimada: "$20,000 - $50,000",
          mensaje: "",
        });
      } else {
        throw new Error("No se pudo procesar la solicitud.");
      }
    } catch (err) {
      // Fallback local en caso de estar offline
      const localData = JSON.parse(localStorage.getItem("emprendedores_solicitudes") || "[]");
      localData.push({ ...formData, id: Date.now(), estado: "Nuevo", fecha: new Date().toISOString() });
      localStorage.setItem("emprendedores_solicitudes", JSON.stringify(localData));

      setResponseMsg({ type: "success", text: t.localSuccessMsg || "¡Solicitud registrada localmente! Nos comunicaremos contigo a la brevedad." });
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        ciudad: "",
        inversion_estimada: "$20,000 - $50,000",
        mensaje: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emp-container">
      {/* Hero Section */}
      <div className="emp-hero">
        <div className="emp-hero-overlay"></div>
        <div className="emp-hero-content">
          <span className="emp-badge"><FaRocket /> {t.publicBadge || "OPORTUNIDAD DE NEGOCIO"}</span>
          <h1>{t.publicTitle || "Únete a la Red de Emprendedores y Franquicias"}</h1>
          <p>
            {t.publicSubtitle || "Lleva el concepto de Vendetta Fitness Industry a tu ciudad. Un modelo de negocio rentable con tecnología de vanguardia y soporte integral de marca."}
          </p>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="emp-benefits-grid">
        <div className="emp-card">
          <div className="emp-card-icon"><FaChartLine /></div>
          <h3>{t.benefit1Title || "Alta Rentabilidad"}</h3>
          <p>{t.benefit1Desc || "Retorno de inversión estimado entre 12 a 24 meses gracias a nuestras múltiples vías de ingresos (membresías, personal training, cafetería y suplementos)."}</p>
        </div>
        <div className="emp-card">
          <div className="emp-card-icon"><FaBuilding /></div>
          <h3>{t.benefit2Title || "Llave en Mano"}</h3>
          <p>{t.benefit2Desc || "Te guiamos en la búsqueda del local, diseño arquitectónico, compra de maquinaria de última generación e instalación de sistemas inteligentes."}</p>
        </div>
        <div className="emp-card">
          <div className="emp-card-icon"><FaHandshake /></div>
          <h3>{t.benefit3Title || "Capacitación & Roles"}</h3>
          <p>{t.benefit3Desc || "Formación completa para tu personal (recepcionistas, entrenadores, nutricionistas, administradores y contadores) con nuestros protocolos operativos."}</p>
        </div>
      </div>

      {/* Main Content Area: Form & Details */}
      <div className="emp-main-wrapper">
        <div className="emp-info-panel">
          <h2>¿Por qué emprender con Vendetta Fitness?</h2>
          <ul className="emp-list">
            <li><FaCheckCircle className="icon-check" /> <strong>Marca consolidada</strong> con posicionamiento premium e imagen impactante.</li>
            <li><FaCheckCircle className="icon-check" /> <strong>Software de Gestión Integrado</strong> con acceso multi-rol (Superadmin, Recepción, Nutrición, Finanzas).</li>
            <li><FaCheckCircle className="icon-check" /> <strong>Estrategias de Marketing</strong> automatizadas para captación masiva de miembros en pre-apertura.</li>
            <li><FaCheckCircle className="icon-check" /> <strong>Soporte legal, contable y operativo</strong> continuo 24/7.</li>
          </ul>

          <div className="emp-contact-box">
            <h4><FaPhoneAlt /> Consultas Directas de Expansión</h4>
            <p><FaEnvelope /> emprendedores@vendettafitness.com</p>
            <p><FaPhoneAlt /> +593 98 765 4321</p>
          </div>
        </div>

        <div className="emp-form-panel">
          <h3>{t.formTitle || "Solicitud de Franquicia / Asociación"}</h3>
          <p>{t.formSubtitle || "Completa tus datos y un director de expansión evaluará tu perfil."}</p>

          {responseMsg && (
            <div className={`emp-alert ${responseMsg.type}`}>
              {responseMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="emp-form">
            <div className="emp-form-group">
              <label>{t.fullName || "Nombre Completo *"}</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Carlos Mendoza"
                required
              />
            </div>

            <div className="emp-form-row">
              <div className="emp-form-group">
                <label>{t.email || "Correo Electrónico *"}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="carlos@ejemplo.com"
                  required
                />
              </div>

              <div className="emp-form-group">
                <label>{t.phone || "Teléfono / WhatsApp *"}</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="0991234567"
                  required
                />
              </div>
            </div>

            <div className="emp-form-row">
              <div className="emp-form-group">
                <label>{t.city || "Ciudad de Interés *"}</label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  placeholder="Ej: Quito, Guayaquil, Cuenca..."
                  required
                />
              </div>

              <div className="emp-form-group">
                <label>{t.estimatedInvestment || "Inversión Estimada"}</label>
                <select name="inversion_estimada" value={formData.inversion_estimada} onChange={handleChange}>
                  <option value="$10,000 - $20,000">$10,000 - $20,000</option>
                  <option value="$20,000 - $50,000">$20,000 - $50,000</option>
                  <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                  <option value="Más de $100,000">Más de $100,000</option>
                </select>
              </div>
            </div>

            <div className="emp-form-group">
              <label>{t.proposalVision || "Cuéntanos sobre tu propuesta o visión"}</label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows="4"
                placeholder="Indícanos si posees local propio, experiencia previa en negocios o preguntas específicas..."
              ></textarea>
            </div>

            <button type="submit" className="emp-submit-btn" disabled={loading}>
              {loading ? (t.submitting || "Enviando Solicitud...") : <><FaPaperPlane /> {t.btnSubmit || "Enviar Solicitud de Emprendedor"}</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EmprendedoresSection;
