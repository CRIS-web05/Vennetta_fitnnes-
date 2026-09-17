import React, { useState, useEffect } from "react";
import {
  FaDumbbell,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFire,
  FaUserTie,
  FaMapMarkerAlt,
  FaStopwatch,
  FaLayerGroup,
  FaCalendarAlt,
  FaTimes
} from "react-icons/fa";
import { apiFetch, hasRole } from "../utils/auth";
import { getTranslation } from "../translations";
import "../styles/rutinas.css";

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const NIVELES = ["Principiante", "Intermedio", "Avanzado"];

const emptyRutina = {
  nombre: "",
  descripcion: "",
  sucursal_id: "",
  nivel: "Intermedio",
  duracion_minutos: 60,
  horarios: [{ dia_semana: "Lunes", hora_inicio: "07:00", hora_fin: "08:00", cupo_maximo: 20 }],
  ejercicios: [{ nombre: "", series: 3, repeticiones: "12", descanso_seg: 60 }],
};

const DEFAULT_RUTINAS = [
  {
    id: 1,
    nombre: "Rutina Hipertrofia & Fuerza (Pecho y Tríceps)",
    descripcion: "Enfoque en ganancia de masa muscular y desarrollo de fuerza máxima con sobrecarga progresiva.",
    nivel: "Avanzado",
    duracion_minutos: 75,
    sucursal_nombre: "Vendetta Fitness Matriz",
    entrenador_nombre: "Carlos Mendoza (Entrenador)",
    horarios: [
      { id: 101, dia_semana: "Lunes", hora_inicio: "07:00:00", hora_fin: "08:15:00", cupo_maximo: 20 },
      { id: 102, dia_semana: "Miércoles", hora_inicio: "07:00:00", hora_fin: "08:15:00", cupo_maximo: 20 },
      { id: 103, dia_semana: "Viernes", hora_inicio: "07:00:00", hora_fin: "08:15:00", cupo_maximo: 20 }
    ],
    ejercicios: [
      { id: 1, nombre: "Press de Banca Plano con Barra", series: 4, repeticiones: "8-10", descanso_seg: 90 },
      { id: 2, nombre: "Press Inclinado con Mancuernas", series: 4, repeticiones: "10-12", descanso_seg: 75 },
      { id: 3, nombre: "Aperturas en Polea Alta", series: 3, repeticiones: "12-15", descanso_seg: 60 },
      { id: 4, nombre: "Fondos en Paralelas (Tríceps)", series: 3, repeticiones: "10-12", descanso_seg: 60 },
      { id: 5, nombre: "Extensión de Tríceps en Polea Alta", series: 4, repeticiones: "12", descanso_seg: 60 }
    ]
  },
  {
    id: 2,
    nombre: "Rutina Resistencia & Funcional High-Intensity",
    descripcion: "Circuito de alta intensidad para tonificación, quema acelerada de grasa y agilidad.",
    nivel: "Intermedio",
    duracion_minutos: 60,
    sucursal_nombre: "Vendetta Fitness Matriz",
    entrenador_nombre: "María Fernández (Entrenadora)",
    horarios: [
      { id: 104, dia_semana: "Martes", hora_inicio: "09:00:00", hora_fin: "10:00:00", cupo_maximo: 18 },
      { id: 105, dia_semana: "Jueves", hora_inicio: "09:00:00", hora_fin: "10:00:00", cupo_maximo: 18 },
      { id: 106, dia_semana: "Sábado", hora_inicio: "10:00:00", hora_fin: "11:00:00", cupo_maximo: 25 }
    ],
    ejercicios: [
      { id: 6, nombre: "Kettlebell Swings", series: 4, repeticiones: "20", descanso_seg: 45 },
      { id: 7, nombre: "Burpees con Salto Explosivo", series: 4, repeticiones: "15", descanso_seg: 45 },
      { id: 8, nombre: "Sentadillas Goblet con Mancuerna", series: 4, repeticiones: "15", descanso_seg: 45 },
      { id: 9, nombre: "Flexiones Esparta", series: 3, repeticiones: "12", descanso_seg: 45 },
      { id: 10, nombre: "Plancha Abdominal Activa", series: 4, repeticiones: "60 seg", descanso_seg: 30 }
    ]
  },
  {
    id: 3,
    nombre: "Rutina Definición Muscular & Espalda/Bíceps",
    descripcion: "Esculpido muscular y trabajo de espalda ancha en V con ejercicios de tracción.",
    nivel: "Principiante",
    duracion_minutos: 60,
    sucursal_nombre: "Vendetta Fitness Matriz",
    entrenador_nombre: "Alex Fitness (Entrenador)",
    horarios: [
      { id: 107, dia_semana: "Lunes", hora_inicio: "18:00:00", hora_fin: "19:00:00", cupo_maximo: 20 },
      { id: 108, dia_semana: "Miércoles", hora_inicio: "18:00:00", hora_fin: "19:00:00", cupo_maximo: 20 },
      { id: 109, dia_semana: "Viernes", hora_inicio: "18:00:00", hora_fin: "19:00:00", cupo_maximo: 20 }
    ],
    ejercicios: [
      { id: 11, nombre: "Dominadas en Barra Fija", series: 4, repeticiones: "8-10", descanso_seg: 90 },
      { id: 12, nombre: "Remo Horizontal con Barra T", series: 4, repeticiones: "10-12", descanso_seg: 75 },
      { id: 13, nombre: "Jalón al Pecho Agarre Abierto", series: 3, repeticiones: "12", descanso_seg: 60 },
      { id: 14, nombre: "Curl de Bíceps con Barra Z", series: 4, repeticiones: "12", descanso_seg: 60 },
      { id: 15, nombre: "Curl Martillo Alternado", series: 3, repeticiones: "12", descanso_seg: 60 }
    ]
  }
];

function RutinasManager({ selectedLanguage }) {
  const locale = selectedLanguage?.code || "es";
  const t = getTranslation(locale, "rutinas");

  const [rutinas, setRutinas] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyRutina);
  const [msg, setMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterNivel, setFilterNivel] = useState("Todos");

  const canEdit = hasRole("superadmin", "admin_gym", "entrenador");

  const load = async () => {
    try {
      const [r, s] = await Promise.all([
        apiFetch("/api/rutinas/public").catch(() => apiFetch("/api/rutinas")),
        apiFetch("/api/sucursales/public").catch(() => []),
      ]);
      if (Array.isArray(r) && r.length > 0) {
        setRutinas(r);
        localStorage.setItem("admin_rutinas", JSON.stringify(r));
      } else {
        const localR = JSON.parse(localStorage.getItem("admin_rutinas") || "[]");
        setRutinas(localR.length > 0 ? localR : DEFAULT_RUTINAS);
      }
      setSucursales(s);
    } catch (e) {
      const localR = JSON.parse(localStorage.getItem("admin_rutinas") || "[]");
      setRutinas(localR.length > 0 ? localR : DEFAULT_RUTINAS);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyRutina);
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({
      nombre: r.nombre,
      descripcion: r.descripcion || "",
      sucursal_id: r.sucursal_id || "",
      nivel: r.nivel || "Intermedio",
      duracion_minutos: r.duracion_minutos || 60,
      activa: r.activa !== 0,
      horarios: r.horarios?.length ? r.horarios.map((h) => ({
        dia_semana: h.dia_semana,
        hora_inicio: String(h.hora_inicio).slice(0, 5),
        hora_fin: String(h.hora_fin).slice(0, 5),
        cupo_maximo: h.cupo_maximo || 20,
      })) : emptyRutina.horarios,
      ejercicios: r.ejercicios?.length ? r.ejercicios.map((e) => ({
        nombre: e.nombre,
        series: e.series,
        repeticiones: e.repeticiones,
        descanso_seg: e.descanso_seg,
      })) : emptyRutina.ejercicios,
    });
    setShowModal(true);
  };

  const addHorario = () => {
    setForm({
      ...form,
      horarios: [...form.horarios, { dia_semana: "Lunes", hora_inicio: "09:00", hora_fin: "10:00", cupo_maximo: 20 }],
    });
  };

  const addEjercicio = () => {
    setForm({
      ...form,
      ejercicios: [...form.ejercicios, { nombre: "", series: 3, repeticiones: "12", descanso_seg: 60 }],
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      sucursal_id: form.sucursal_id || null,
      horarios: form.horarios.map((h) => ({
        ...h,
        hora_inicio: h.hora_inicio.includes(":") && h.hora_inicio.split(":").length === 2 ? h.hora_inicio + ":00" : h.hora_inicio,
        hora_fin: h.hora_fin.includes(":") && h.hora_fin.split(":").length === 2 ? h.hora_fin + ":00" : h.hora_fin,
      })),
      ejercicios: form.ejercicios.filter((ex) => ex.nombre.trim()),
    };

    let updatedList = [...rutinas];
    try {
      if (editing) {
        await apiFetch(`/api/rutinas/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
        setMsg("✅ Rutina actualizada exitosamente en MySQL.");
        updatedList = rutinas.map((r) => (r.id === editing.id ? { ...r, ...payload } : r));
      } else {
        const res = await apiFetch("/api/rutinas", { method: "POST", body: JSON.stringify(payload) });
        setMsg("✅ Rutina creada exitosamente en MySQL.");
        const newRut = res.id ? { id: res.id, ...payload } : { id: Date.now(), ...payload };
        updatedList = [newRut, ...rutinas];
      }
    } catch (err) {
      if (editing) {
        updatedList = rutinas.map((r) => (r.id === editing.id ? { ...r, ...payload } : r));
        setMsg("✅ Rutina actualizada localmente.");
      } else {
        const newRut = { id: Date.now(), ...payload };
        updatedList = [newRut, ...rutinas];
        setMsg("✅ Rutina creada localmente.");
      }
    }

    setRutinas(updatedList);
    localStorage.setItem("admin_rutinas", JSON.stringify(updatedList));
    setShowModal(false);
    setTimeout(() => setMsg(""), 3500);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta rutina?")) return;
    try {
      await apiFetch(`/api/rutinas/${id}`, { method: "DELETE" });
      setMsg("✅ Rutina eliminada de MySQL.");
    } catch (err) {
      setMsg("✅ Rutina eliminada localmente.");
    }

    const updated = rutinas.filter((r) => r.id !== id);
    setRutinas(updated);
    localStorage.setItem("admin_rutinas", JSON.stringify(updated));
    setTimeout(() => setMsg(""), 3500);
  };

  const filteredRutinas = rutinas.filter((r) => {
    const matchesSearch =
      r.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.descripcion && r.descripcion.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.ejercicios && r.ejercicios.some((e) => e.nombre.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesNivel = filterNivel === "Todos" || r.nivel.toLowerCase() === filterNivel.toLowerCase();
    return matchesSearch && matchesNivel;
  });

  return (
    <div className="rutinas-container">
      
      {/* 🔥 HERO HEADER */}
      <header className="rutinas-hero">
        <div className="rutinas-hero-info">
          <span className="rutinas-badge-hero">
            <FaFire /> {t.badge || "PROGRAMAS ELITE VENDETTA"}
          </span>
          <h2>
            <FaDumbbell /> {t.title || "Rutinas y Planes de Entrenamiento"}
          </h2>
          <p>
            {t.desc || "Diseñados por entrenadores profesionales para hipertrofia, resistencia, fuerza y tonificación muscular avanzada."}
          </p>
        </div>

        <div className="rutinas-hero-stats">
          <div className="rutinas-stat-pill">
            <strong>{rutinas.length}</strong>
            <span>{t.statRutinas || "Rutinas"}</span>
          </div>
          <div className="rutinas-stat-pill">
            <strong>{NIVELES.length}</strong>
            <span>{t.statNiveles || "Niveles"}</span>
          </div>
          {canEdit && (
            <button type="button" className="btn-add-rutina" onClick={openAdd}>
              <FaPlus /> {t.btnNew || "Nueva Rutina"}
            </button>
          )}
        </div>
      </header>

      {msg && <div className="sa-msg" style={{ marginBottom: "20px" }}>{msg}</div>}

      {/* 🔥 BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="rutinas-toolbar">
        <div className="rutinas-search-box">
          <FaSearch />
          <input
            type="text"
            placeholder={t.searchPlaceholder || "Buscar por nombre, objetivo o ejercicio..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="rutinas-filter-pills">
          <button
            type="button"
            className={`filter-pill-btn ${filterNivel === "Todos" ? "active" : ""}`}
            onClick={() => setFilterNivel("Todos")}
          >
            {t.filterAll || "Todos"} ({rutinas.length})
          </button>
          {NIVELES.map((n) => {
            const count = rutinas.filter((r) => r.nivel?.toLowerCase() === n.toLowerCase()).length;
            return (
              <button
                key={n}
                type="button"
                className={`filter-pill-btn ${filterNivel === n ? "active" : ""}`}
                onClick={() => setFilterNivel(n)}
              >
                {n} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 🔥 GRID DE TARJETAS DE RUTINAS */}
      <div className="rutinas-grid">
        {filteredRutinas.map((r) => {
          const nivelClass = (r.nivel || "").toLowerCase();
          return (
            <article key={r.id} className="rutina-card">
              <div>
                <div className="rutina-card-top">
                  <h3 className="rutina-card-title">{r.nombre}</h3>
                  <span className={`nivel-badge ${nivelClass}`}>{r.nivel}</span>
                </div>

                <p className="rutina-card-desc">{r.descripcion || "Plan personalizado de acondicionamiento físico."}</p>

                {/* METADATOS */}
                <div className="rutina-meta-list">
                  <div className="rutina-meta-item">
                    <FaMapMarkerAlt />
                    <span><strong>Sucursal:</strong> {r.sucursal_nombre || "Matriz Vendetta Fitness"}</span>
                  </div>
                  <div className="rutina-meta-item">
                    <FaStopwatch />
                    <span><strong>Duración:</strong> {r.duracion_minutos} minutos por sesión</span>
                  </div>
                  {r.entrenador_nombre && (
                    <div className="rutina-meta-item">
                      <FaUserTie />
                      <span><strong>Coach:</strong> {r.entrenador_nombre}</span>
                    </div>
                  )}
                </div>

                {/* HORARIOS */}
                {r.horarios?.length > 0 && (
                  <div className="rutina-horarios-box">
                    <div className="rutina-horarios-title">
                      <FaCalendarAlt /> Horarios Disponibles:
                    </div>
                    <div className="rutina-chips-flex">
                      {r.horarios.map((h) => (
                        <span key={h.id || Math.random()} className="horario-chip">
                          <span className="horario-chip-dia">{h.dia_semana}:</span>
                          {String(h.hora_inicio).slice(0, 5)} - {String(h.hora_fin).slice(0, 5)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* EJERCICIOS CLAVE */}
                {r.ejercicios?.length > 0 && (
                  <div className="rutina-ejercicios-box">
                    <div className="rutina-ejercicios-title">
                      <span><FaLayerGroup /> Ejercicios ({r.ejercicios.length})</span>
                    </div>
                    {r.ejercicios.slice(0, 4).map((e) => (
                      <div key={e.id || Math.random()} className="ejercicio-item">
                        <span className="ejercicio-nombre">{e.nombre}</span>
                        <span className="ejercicio-badge-sets">{e.series} x {e.repeticiones}</span>
                      </div>
                    ))}
                    {r.ejercicios.length > 4 && (
                      <div style={{ fontSize: "12px", color: "#ff4d4d", marginTop: "6px", fontWeight: "700" }}>
                        + {r.ejercicios.length - 4} ejercicios adicionales en el programa
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* BOTONES EDICIÓN */}
              {canEdit && (
                <div className="rutina-card-actions">
                  <button type="button" className="btn-card-action" onClick={() => openEdit(r)}>
                    <FaEdit /> Editar
                  </button>
                  {hasRole("superadmin", "admin_gym") && (
                    <button type="button" className="btn-card-action danger" onClick={() => handleDelete(r.id)}>
                      <FaTrash /> Eliminar
                    </button>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* 🔥 MODAL DE CREACIÓN / EDICIÓN */}
      {showModal && (
        <div className="rutinas-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="rutinas-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="rutinas-modal-header">
              <h3>
                <FaDumbbell /> {editing ? "Editar Rutina de Entrenamiento" : "Crear Nueva Rutina"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: "18px" }}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="rutinas-form-group">
                <label>Nombre del programa</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej: Rutina Hipertrofia Fuerza Vol. 2"
                  required
                />
              </div>

              <div className="rutinas-form-group">
                <label>Descripción detallada</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Explica el enfoque del programa, grupos musculares involucrados y técnica recomendada..."
                  rows={3}
                />
              </div>

              <div className="rutinas-form-row">
                <div className="rutinas-form-group">
                  <label>Sucursal</label>
                  <select value={form.sucursal_id} onChange={(e) => setForm({ ...form, sucursal_id: e.target.value })}>
                    <option value="">— Todas las sucursales —</option>
                    {sucursales.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rutinas-form-group">
                  <label>Dificultad / Nivel</label>
                  <select value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value })}>
                    {NIVELES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rutinas-form-group">
                  <label>Duración (Minutos)</label>
                  <input
                    type="number"
                    value={form.duracion_minutos}
                    onChange={(e) => setForm({ ...form, duracion_minutos: +e.target.value })}
                  />
                </div>
              </div>

              {/* CONSTRUCTOR DE HORARIOS */}
              <div className="rutinas-section-builder">
                <div className="rutinas-builder-title">
                  <span>📅 Horarios y Clases</span>
                  <button type="button" className="btn-add-subitem" onClick={addHorario}>
                    + Agregar Horario
                  </button>
                </div>

                {form.horarios.map((h, i) => (
                  <div key={i} className="builder-row">
                    <select
                      value={h.dia_semana}
                      onChange={(e) => {
                        const horarios = [...form.horarios];
                        horarios[i] = { ...h, dia_semana: e.target.value };
                        setForm({ ...form, horarios });
                      }}
                    >
                      {DIAS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>

                    <input
                      type="time"
                      value={h.hora_inicio}
                      onChange={(e) => {
                        const horarios = [...form.horarios];
                        horarios[i] = { ...h, hora_inicio: e.target.value };
                        setForm({ ...form, horarios });
                      }}
                    />
                    <span style={{ color: "#888" }}>a</span>
                    <input
                      type="time"
                      value={h.hora_fin}
                      onChange={(e) => {
                        const horarios = [...form.horarios];
                        horarios[i] = { ...h, hora_fin: e.target.value };
                        setForm({ ...form, horarios });
                      }}
                    />

                    <input
                      type="number"
                      placeholder="Cupo"
                      value={h.cupo_maximo}
                      onChange={(e) => {
                        const horarios = [...form.horarios];
                        horarios[i] = { ...h, cupo_maximo: +e.target.value };
                        setForm({ ...form, horarios });
                      }}
                      style={{ width: "90px" }}
                    />
                  </div>
                ))}
              </div>

              {/* CONSTRUCTOR DE EJERCICIOS */}
              <div className="rutinas-section-builder">
                <div className="rutinas-builder-title">
                  <span>💪 Lista de Ejercicios</span>
                  <button type="button" className="btn-add-subitem" onClick={addEjercicio}>
                    + Agregar Ejercicio
                  </button>
                </div>

                {form.ejercicios.map((ex, i) => (
                  <div key={i} className="builder-row">
                    <input
                      type="text"
                      placeholder="Nombre del Ejercicio"
                      value={ex.nombre}
                      onChange={(ev) => {
                        const ejercicios = [...form.ejercicios];
                        ejercicios[i] = { ...ex, nombre: ev.target.value };
                        setForm({ ...form, ejercicios });
                      }}
                      style={{ flex: 2 }}
                    />
                    <input
                      type="number"
                      placeholder="Series"
                      value={ex.series}
                      onChange={(ev) => {
                        const ejercicios = [...form.ejercicios];
                        ejercicios[i] = { ...ex, series: +ev.target.value };
                        setForm({ ...form, ejercicios });
                      }}
                      style={{ width: "80px" }}
                    />
                    <input
                      type="text"
                      placeholder="Reps"
                      value={ex.repeticiones}
                      onChange={(ev) => {
                        const ejercicios = [...form.ejercicios];
                        ejercicios[i] = { ...ex, repeticiones: ev.target.value };
                        setForm({ ...form, ejercicios });
                      }}
                      style={{ width: "90px" }}
                    />
                  </div>
                ))}
              </div>

              <div className="rutinas-modal-footer">
                <button type="button" className="btn-modal-cancel" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-modal-submit">
                  Guardar Rutina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RutinasManager;
