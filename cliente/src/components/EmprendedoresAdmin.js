import React, { useState, useEffect } from "react";
import { FaRocket, FaCheck, FaTimes, FaSync } from "react-icons/fa";
import { apiFetch, hasRole } from "../utils/auth";
import { getTranslation } from "../translations";

const ESTADOS_KEYS = [
  { key: "statusNew", defaultLabel: "Nuevo", raw: "Nuevo" },
  { key: "statusContacted", defaultLabel: "Contactado", raw: "Contactado" },
  { key: "statusEvaluating", defaultLabel: "En evaluación", raw: "En evaluación" },
  { key: "statusApproved", defaultLabel: "Aprobado", raw: "Aprobado" },
  { key: "statusRejected", defaultLabel: "Rechazado", raw: "Rechazado" },
];

function EmprendedoresAdmin({ selectedLanguage }) {
  const locale = selectedLanguage?.code || "es";
  const t = getTranslation(locale, "emprendedores");

  const [leads, setLeads] = useState([]);
  const [msg, setMsg] = useState("");
  const canEdit = hasRole("superadmin", "admin_gym");

  const load = async () => {
    try {
      const data = await apiFetch("/api/emprendedores");
      if (Array.isArray(data) && data.length > 0) {
        setLeads(data);
        localStorage.setItem("emprendedores_solicitudes", JSON.stringify(data));
        return;
      }
    } catch (e) {
      console.warn("Servidor offline, recuperando solicitudes locales:", e);
    }

    const localData = JSON.parse(localStorage.getItem("emprendedores_solicitudes") || "[]");
    if (localData.length === 0) {
      // Datos demo iniciales
      const demoData = [
        {
          id: 1,
          nombre: "Mateo Silva",
          email: "mateo.silva@ejemplo.com",
          telefono: "0991234567",
          ciudad: "Quito Norte",
          inversion_estimada: "$20,000 - $50,000",
          mensaje: "Interesado en aperturar una franquicia en la zona del Batan.",
          estado: "En evaluación",
          created_at: new Date().toISOString()
        }
      ];
      setLeads(demoData);
      localStorage.setItem("emprendedores_solicitudes", JSON.stringify(demoData));
    } else {
      setLeads(localData);
    }
  };

  useEffect(() => { load(); }, []);

  const getStatusLabel = (rawEstado) => {
    const found = ESTADOS_KEYS.find((item) => item.raw === rawEstado);
    if (found && t[found.key]) return t[found.key];
    return rawEstado;
  };

  const updateEstado = async (id, rawEstado) => {
    const label = getStatusLabel(rawEstado);
    try {
      await apiFetch(`/api/emprendedores/${id}`, { method: "PUT", body: JSON.stringify({ estado: rawEstado }) });
      setMsg(`Estado actualizado a: ${label}`);
    } catch (err) {
      setMsg(`Estado actualizado localmente a: ${label}`);
    }

    const updated = leads.map((l) => (l.id === id ? { ...l, estado: rawEstado } : l));
    setLeads(updated);
    localStorage.setItem("emprendedores_solicitudes", JSON.stringify(updated));
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="sa-section">
      <div className="sa-section-header">
        <h2><FaRocket /> {t.title || "Solicitudes de Emprendedores y Franquicias"}</h2>
        <button type="button" className="sa-btn-primary" onClick={load}>
          <FaSync /> {t.btnRefresh || "Actualizar Solicitudes"}
        </button>
      </div>
      {msg && <div className="sa-msg">{msg}</div>}

      <div className="sa-leads-list">
        {leads.length === 0 && <p className="sa-empty">{t.noLeads || "No hay solicitudes aún."}</p>}
        {leads.map((l) => (
          <div key={l.id} className={`sa-card sa-lead-card estado-${l.estado?.replace(/\s/g, "-").toLowerCase()}`}>
            <div className="sa-lead-header">
              <h3>{l.nombre}</h3>
              <span className="sa-badge">{getStatusLabel(l.estado)}</span>
            </div>
            <p>📧 {l.email} · 📞 {l.telefono || "—"}</p>
            <p>📍 {l.ciudad || "—"} · 💰 {t.investment || "Inversión:"} {l.inversion_estimada || (t.notIndicated || "No indicada")}</p>
            <p className="sa-lead-msg">{l.mensaje}</p>
            <small>{new Date(l.created_at || Date.now()).toLocaleString(locale)}</small>
            {canEdit && (
              <div className="sa-lead-actions">
                {ESTADOS_KEYS.map((est) => {
                  const estLabel = t[est.key] || est.defaultLabel;
                  return (
                    <button
                      key={est.raw}
                      type="button"
                      className={`sa-btn-sm ${l.estado === est.raw ? "active" : ""}`}
                      onClick={() => updateEstado(l.id, est.raw)}
                    >
                      {est.raw === "Aprobado" ? <FaCheck /> : est.raw === "Rechazado" ? <FaTimes /> : null} {estLabel}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmprendedoresAdmin;
