import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaBuilding } from "react-icons/fa";
import { apiFetch, hasRole } from "../utils/auth";
import { getTranslation } from "../translations";

const emptyForm = {
  nombre: "",
  direccion: "",
  telefono: "",
  horario_apertura: "06:00",
  horario_cierre: "22:00",
  lat: "",
  lng: "",
  es_matriz: false,
  activa: true,
};

function SucursalesManager({ selectedLanguage }) {
  const locale = selectedLanguage?.code || "es";
  const t = getTranslation(locale, "sucursales");

  const [sucursales, setSucursales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState("");
  const canEdit = hasRole("superadmin", "admin_gym");
  const canDelete = hasRole("superadmin");

  const load = async () => {
    try {
      const data = await apiFetch("/api/sucursales");
      if (Array.isArray(data) && data.length > 0) {
        setSucursales(data);
        localStorage.setItem("admin_sucursales", JSON.stringify(data));
        return;
      }
    } catch (e) {
      console.warn("Servidor offline para sucursales, cargando almacenamiento local.");
    }

    const localData = localStorage.getItem("admin_sucursales");
    if (localData) {
      try {
        setSucursales(JSON.parse(localData));
        return;
      } catch (e) {}
    }

    const defaultSucursales = [
      { id: 1, nombre: "Vendetta Fitness Matriz (Quito Norte)", direccion: "Av. Galo Plaza Lasso N45-12 y Real Audiencia", telefono: "0991234567", horario_apertura: "06:00:00", horario_cierre: "22:00:00", lat: "-0.1807", lng: "-78.4678", es_matriz: true, activa: true },
      { id: 2, nombre: "Vendetta Fitness Sur (El Recreo)", direccion: "Av. Pedro Vicente Maldonado y El Recreo", telefono: "0997654321", horario_apertura: "06:00:00", horario_cierre: "21:00:00", lat: "-0.2450", lng: "-78.5210", es_matriz: false, activa: true },
      { id: 3, nombre: "Vendetta Fitness Cumbayá (Centro Comercial)", direccion: "Av. Interoceánica km 12, Cumbayá", telefono: "0998887766", horario_apertura: "06:00:00", horario_cierre: "22:00:00", lat: "-0.1980", lng: "-78.4350", es_matriz: false, activa: true }
    ];
    setSucursales(defaultSucursales);
    localStorage.setItem("admin_sucursales", JSON.stringify(defaultSucursales));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      nombre: s.nombre,
      direccion: s.direccion || "",
      telefono: s.telefono || "",
      horario_apertura: (s.horario_apertura || "06:00:00").slice(0, 5),
      horario_cierre: (s.horario_cierre || "22:00:00").slice(0, 5),
      lat: s.lat || "",
      lng: s.lng || "",
      es_matriz: !!s.es_matriz,
      activa: !!s.activa,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      horario_apertura: form.horario_apertura + ":00",
      horario_cierre: form.horario_cierre + ":00",
      lat: form.lat || null,
      lng: form.lng || null,
    };

    let updatedList = [...sucursales];
    try {
      if (editing) {
        await apiFetch(`/api/sucursales/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
        setMsg(t.updatedMsg || "Sucursal actualizada.");
        updatedList = sucursales.map(s => s.id === editing.id ? { ...s, ...payload } : s);
      } else {
        const res = await apiFetch("/api/sucursales", { method: "POST", body: JSON.stringify(payload) });
        setMsg(t.createdMsg || "Sucursal creada.");
        const newSuc = res.id ? { id: res.id, ...payload } : { id: Date.now(), ...payload };
        updatedList = [newSuc, ...sucursales];
      }
    } catch (err) {
      if (editing) {
        updatedList = sucursales.map(s => s.id === editing.id ? { ...s, ...payload } : s);
        setMsg(t.updatedMsg || "Sucursal actualizada localmente.");
      } else {
        const newSuc = { id: Date.now(), ...payload };
        updatedList = [newSuc, ...sucursales];
        setMsg(t.createdMsg || "Sucursal creada localmente.");
      }
    }

    setSucursales(updatedList);
    localStorage.setItem("admin_sucursales", JSON.stringify(updatedList));
    setShowModal(false);
    setTimeout(() => setMsg(""), 3500);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.confirmDelete || "¿Eliminar esta sucursal?")) return;
    try {
      await apiFetch(`/api/sucursales/${id}`, { method: "DELETE" });
      setMsg(t.deletedMsg || "Sucursal eliminada.");
    } catch (err) {
      setMsg(t.deletedMsg || "Sucursal eliminada localmente.");
    }

    const updated = sucursales.filter((s) => s.id !== id);
    setSucursales(updated);
    localStorage.setItem("admin_sucursales", JSON.stringify(updated));
    setTimeout(() => setMsg(""), 3500);
  };

  return (
    <div className="sa-section">
      <div className="sa-section-header">
        <h2><FaBuilding /> {t.title || "Sucursales"}</h2>
        {canEdit && (
          <button type="button" className="sa-btn-primary" onClick={openAdd}>
            <FaPlus /> {t.btnAdd || "Añadir sucursal"}
          </button>
        )}
      </div>
      {msg && <div className="sa-msg">{msg}</div>}

      <div className="sa-grid">
        {(Array.isArray(sucursales) ? sucursales : []).map((s) => (
          <div key={s.id} className={`sa-card ${s.es_matriz ? "sa-card-matriz" : ""}`}>
            <div className="sa-card-badge">{s.es_matriz ? (t.matrizBadge || "MATRIZ") : (t.branchBadge || "SUCURSAL")}</div>
            <h3>{s.nombre}</h3>
            <p><FaMapMarkerAlt /> {s.direccion}</p>
            <p>📞 {s.telefono || "—"}</p>
            <p>🕐 {String(s.horario_apertura).slice(0, 5)} – {String(s.horario_cierre).slice(0, 5)}</p>
            <span className={`sa-status ${s.activa ? "active" : "inactive"}`}>
              {s.activa ? (t.active || "Activa") : (t.inactive || "Inactiva")}
            </span>
            {canEdit && (
              <div className="sa-card-actions">
                <button type="button" onClick={() => openEdit(s)}><FaEdit /></button>
                {canDelete && !s.es_matriz && (
                  <button type="button" className="danger" onClick={() => handleDelete(s.id)}><FaTrash /></button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="sa-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sa-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? (t.editTitle || "Editar sucursal") : (t.createTitle || "Nueva sucursal")}</h3>
            <form onSubmit={handleSave}>
              <label>{t.nameLabel || "Nombre"}<input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /></label>
              <label>{t.addressLabel || "Dirección"}<input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} /></label>
              <label>{t.phoneLabel || "Teléfono"}<input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} /></label>
              <div className="sa-row">
                <label>{t.openingLabel || "Apertura"}<input type="time" value={form.horario_apertura} onChange={(e) => setForm({ ...form, horario_apertura: e.target.value })} /></label>
                <label>{t.closingLabel || "Cierre"}<input type="time" value={form.horario_cierre} onChange={(e) => setForm({ ...form, horario_cierre: e.target.value })} /></label>
              </div>
              <div className="sa-row">
                <label>{t.latLabel || "Latitud"}<input value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} placeholder="-0.1807" /></label>
                <label>{t.lngLabel || "Longitud"}<input value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} placeholder="-78.4678" /></label>
              </div>
              {editing && (
                <label className="sa-checkbox">
                  <input type="checkbox" checked={form.activa} onChange={(e) => setForm({ ...form, activa: e.target.checked })} /> {t.activeCheckbox || "Activa"}
                </label>
              )}
              <div className="sa-modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>{t.cancelBtn || "Cancelar"}</button>
                <button type="submit" className="sa-btn-primary">{t.saveBtn || "Guardar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SucursalesManager;
