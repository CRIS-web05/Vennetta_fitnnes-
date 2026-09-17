import React, { useState, useEffect } from "react";
import { FaPlus, FaUsers, FaInfoCircle } from "react-icons/fa";
import { apiFetch, hasRole, ROLES_INFO } from "../utils/auth";
import { getTranslation } from "../translations";

const DEFAULT_STAFF = [
  {
    id: 1,
    username: "Superadmin Principal",
    email: "admin@gym.com",
    telefono: "0987654321",
    rol: "superadmin",
    rol_nombre: "Superadministrador",
    sucursal_nombre: "Vendetta Fitness Matriz"
  },
  {
    id: 2,
    username: "Carlos Mendoza (Entrenador)",
    email: "carlos.entrenador@gym.com",
    telefono: "0991234567",
    rol: "entrenador",
    rol_nombre: "Entrenador / Personal Trainer",
    horario: "06:00 AM - 14:00 PM",
    hora_exacta: "06:00 AM a 14:00 PM (Turno Mañana)",
    fecha_ingreso: "2026-01-10",
    dias_trabajo: "Lunes a Viernes",
    especialidad: "Hipertrofia, Musculación & Personal Trainer",
    sucursal_nombre: "Vendetta Fitness Matriz",
    estado: "Activo - En turno"
  },
  {
    id: 3,
    username: "María Fernández (Entrenadora)",
    email: "maria.entrenador@gym.com",
    telefono: "0997654321",
    rol: "entrenador",
    rol_nombre: "Entrenador / Personal Trainer",
    horario: "14:00 PM - 22:00 PM",
    hora_exacta: "14:00 PM a 22:00 PM (Turno Tarde)",
    fecha_ingreso: "2026-02-01",
    dias_trabajo: "Lunes a Sábado",
    especialidad: "Entrenamiento Funcional, HIIT & Cardio",
    sucursal_nombre: "Vendetta Fitness Matriz",
    estado: "Activo - En turno"
  },
  {
    id: 4,
    username: "Alex Fitness (Entrenador)",
    email: "alex.entrenador@gym.com",
    telefono: "0998887766",
    rol: "entrenador",
    rol_nombre: "Entrenador / Personal Trainer",
    horario: "08:00 AM - 16:00 PM",
    hora_exacta: "08:00 AM a 16:00 PM (Turno Intermedio)",
    fecha_ingreso: "2026-01-20",
    dias_trabajo: "Lunes, Miércoles y Viernes",
    especialidad: "CrossFit, Potencia y Calistenia",
    sucursal_nombre: "Vendetta Fitness Sur",
    estado: "Activo"
  },
  {
    id: 5,
    username: "Laura Recepción",
    email: "laura.recepcion@gym.com",
    telefono: "0993334455",
    rol: "recepcionista",
    rol_nombre: "Recepcionista",
    sucursal_nombre: "Vendetta Fitness Matriz"
  }
];

function StaffManager({ selectedLanguage }) {
  const locale = selectedLanguage?.code || "es";
  const t = getTranslation(locale, "staff");

  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    telefono: "",
    rol_id: "",
    sucursal_id: "",
    horario: "06:00 AM - 14:00 PM",
    hora_exacta: "06:00 AM a 14:00 PM",
    fecha_ingreso: new Date().toISOString().split("T")[0],
    dias_trabajo: "Lunes a Viernes",
    especialidad: "Personal Trainer"
  });
  const [msg, setMsg] = useState("");
  const [filterRole, setFilterRole] = useState("entrenador");
  const isSuperAdmin = hasRole("superadmin");

  const load = async () => {
    try {
      const [s, r, suc] = await Promise.all([
        apiFetch("/api/staff"),
        apiFetch("/api/roles").catch(() => []),
        apiFetch("/api/sucursales").catch(() => []),
      ]);
      if (Array.isArray(s) && s.length > 0) {
        setStaff(s);
        localStorage.setItem("admin_staff", JSON.stringify(s));
      } else {
        const localS = JSON.parse(localStorage.getItem("admin_staff") || "[]");
        setStaff(localS.length > 0 ? localS : DEFAULT_STAFF);
      }
      setRoles(Array.isArray(r) && r.length > 0 ? r.filter((rol) => rol.slug !== "cliente") : []);
      setSucursales(suc);
    } catch (e) {
      const localS = JSON.parse(localStorage.getItem("admin_staff") || "[]");
      setStaff(localS.length > 0 ? localS : DEFAULT_STAFF);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const newStaffItem = {
      id: Date.now(),
      username: form.username,
      email: form.email,
      telefono: form.telefono || "0991234567",
      rol: form.rol_id === "4" ? "entrenador" : "staff",
      rol_nombre: form.rol_id === "4" ? "Entrenador / Personal Trainer" : "Personal / Staff",
      horario: form.horario || "06:00 AM - 14:00 PM",
      hora_exacta: form.hora_exacta || "06:00 AM a 14:00 PM",
      fecha_ingreso: form.fecha_ingreso || new Date().toISOString().split("T")[0],
      dias_trabajo: form.dias_trabajo || "Lunes a Viernes",
      especialidad: form.especialidad || "Personal Trainer",
      sucursal_nombre: "Vendetta Fitness Matriz"
    };

    let updatedList = [newStaffItem, ...staff];
    try {
      const res = await apiFetch("/api/staff", { method: "POST", body: JSON.stringify(form) });
      if (res && res.id) newStaffItem.id = res.id;
      setMsg("✅ Miembro de staff / entrenador creado en MySQL.");
    } catch (err) {
      setMsg("✅ Miembro de staff / entrenador creado localmente.");
    }

    setStaff(updatedList);
    localStorage.setItem("admin_staff", JSON.stringify(updatedList));
    setShowModal(false);
    setForm({ username: "", email: "", password: "", telefono: "", rol_id: "", sucursal_id: "", horario: "", hora_exacta: "", fecha_ingreso: "", dias_trabajo: "", especialidad: "" });
    setTimeout(() => setMsg(""), 3500);
  };

  const handleRoleChange = async (userId, rol_id, sucursal_id) => {
    const roleObj = roles.find(r => r.id === parseInt(rol_id)) || {};
    const updated = staff.map(u => u.id === userId ? { ...u, rol_id, rol: roleObj.slug || u.rol, rol_nombre: roleObj.nombre || u.rol_nombre } : u);

    try {
      await apiFetch(`/api/staff/${userId}/rol`, {
        method: "PUT",
        body: JSON.stringify({ rol_id, sucursal_id, tipo_usuario: "staff" }),
      });
      setMsg("✅ Rol actualizado en MySQL.");
    } catch (err) {
      setMsg("✅ Rol actualizado localmente.");
    }

    setStaff(updated);
    localStorage.setItem("admin_staff", JSON.stringify(updated));
    setTimeout(() => setMsg(""), 3500);
  };

  if (!isSuperAdmin) {
    return (
      <div className="sa-section" style={{ textAlign: "center", padding: "40px 20px" }}>
        <h2 style={{ color: "#ff2a2a" }}>🔒 Acceso Restringido</h2>
        <p>El apartado de Entrenadores y Personal es exclusivo del <strong>Super Administrador</strong>.</p>
      </div>
    );
  }

  return (
    <div className="sa-section">
      <div className="sa-section-header">
        <h2><FaUsers /> {t.title || "Gestión Exclusiva de Entrenadores y Staff"}</h2>
        {isSuperAdmin && (
          <button type="button" className="sa-btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus /> {t.btnAdd || "Añadir Entrenador / Staff"}
          </button>
        )}
      </div>
      {msg && <div className="sa-msg">{msg}</div>}

      <div className="sa-filter-bar" style={{ display: "flex", gap: "10px", margin: "15px 0" }}>
        <button
          className={`sa-btn-sm ${filterRole === "entrenador" ? "active" : ""}`}
          onClick={() => setFilterRole("entrenador")}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          🏋️ Entrenadores ({staff.filter(u => u.rol === "entrenador" || (u.username && u.username.toLowerCase().includes("entrenad"))).length})
        </button>
        <button
          className={`sa-btn-sm ${filterRole === "todos" ? "active" : ""}`}
          onClick={() => setFilterRole("todos")}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          👥 Todo el Personal ({staff.length})
        </button>
      </div>

      <table className="sa-table">
        <thead>
          <tr>
            <th>{t.colName || "Nombre Entrenador / Staff"}</th>
            <th>{t.colShift || "Email / Teléfono"}</th>
            <th>{t.colShift || "Horario de Trabajo"}</th>
            <th>{t.colBranch || "Sucursal"}</th>
            <th>{t.colSpecialty || "Más Información"}</th>
            {isSuperAdmin && <th>{t.colRole || "Cambiar Rol"}</th>}
          </tr>
        </thead>
        <tbody>
          {staff
            .filter((u) => {
              if (filterRole === "entrenador") {
                return u.rol === "entrenador" || (u.username && u.username.toLowerCase().includes("entrenad"));
              }
              return true;
            })
            .map((u) => (
              <tr key={u.id}>
                <td>
                  <strong>{u.username}</strong>
                  <div>
                    <span className="sa-role-badge" style={{ borderColor: ROLES_INFO[u.rol]?.color || "#ff6b35" }}>
                      {u.rol_nombre || u.rol}
                    </span>
                  </div>
                </td>
                <td>
                  {u.email}
                  {u.telefono && <div style={{ fontSize: "12px", color: "#aaa" }}>📞 {u.telefono}</div>}
                </td>
                <td>
                  <strong style={{ color: "#ff4b4b" }}>{u.horario || "06:00 AM - 14:00 PM"}</strong>
                  <div style={{ fontSize: "12px", color: "#aaa" }}>🗓️ {u.dias_trabajo || "Lunes a Viernes"}</div>
                </td>
                <td>{u.sucursal_nombre || "Vendetta Fitness Matriz"}</td>
                <td>
                  <button
                    type="button"
                    className="sa-btn-sm"
                    onClick={() => setSelectedTrainer(u)}
                  >
                    <FaInfoCircle /> Más información
                  </button>
                </td>
                {isSuperAdmin && (
                  <td>
                    <select
                      defaultValue={u.rol_id || (u.rol === "entrenador" ? 4 : 1)}
                      onChange={(e) => handleRoleChange(u.id, e.target.value, u.sucursal_id)}
                    >
                      {roles.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                    </select>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>

      {/* MODAL MÁS INFORMACIÓN */}
      {selectedTrainer && (
        <div className="sa-modal-overlay" onClick={() => setSelectedTrainer(null)}>
          <div className="sa-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "550px" }}>
            <h3>🏋️ Más Información del Entrenador</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: "16px 0", background: "#111", padding: "16px", borderRadius: "10px" }}>
              <div>
                <small style={{ color: "#888" }}>👤 Nombre</small>
                <div style={{ color: "#fff", fontWeight: "bold" }}>{selectedTrainer.username}</div>
              </div>
              <div>
                <small style={{ color: "#888" }}>⏰ Hora Exacta / Turno</small>
                <div style={{ color: "#ff4b4b", fontWeight: "bold" }}>{selectedTrainer.hora_exacta || selectedTrainer.horario || "06:00 AM a 14:00 PM"}</div>
              </div>
              <div>
                <small style={{ color: "#888" }}>📅 Fecha de Ingreso</small>
                <div style={{ color: "#fff" }}>{selectedTrainer.fecha_ingreso || "2026-01-15"}</div>
              </div>
              <div>
                <small style={{ color: "#888" }}>🗓️ Días que Trabaja</small>
                <div style={{ color: "#ff4b4b", fontWeight: "bold" }}>{selectedTrainer.dias_trabajo || "Lunes a Viernes"}</div>
              </div>
              <div>
                <small style={{ color: "#888" }}>💪 Especialidad</small>
                <div style={{ color: "#fff" }}>{selectedTrainer.especialidad || "Personal Trainer & Fuerza"}</div>
              </div>
              <div>
                <small style={{ color: "#888" }}>🏢 Sucursal</small>
                <div style={{ color: "#fff" }}>{selectedTrainer.sucursal_nombre || "Matriz Central"}</div>
              </div>
              <div>
                <small style={{ color: "#888" }}>📞 Teléfono</small>
                <div style={{ color: "#fff" }}>{selectedTrainer.telefono || "N/A"}</div>
              </div>
              <div>
                <small style={{ color: "#888" }}>📧 Email</small>
                <div style={{ color: "#fff" }}>{selectedTrainer.email}</div>
              </div>
            </div>
            <div className="sa-modal-actions">
              <button type="button" onClick={() => setSelectedTrainer(null)} className="sa-btn-primary">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="sa-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="sa-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t.modalCreateTitle || "Nuevo entrenador / staff"}</h3>
            <form onSubmit={handleCreate}>
              <label>{t.nameLabel || "Usuario / Nombre"}<input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></label>
              <label>{t.emailLabel || "Email"}<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
              <label>Contraseña<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="123456" /></label>
              <label>{t.phoneLabel || "Teléfono"}<input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} /></label>
              <label>{t.shiftLabel || "Horario (Ej: 06:00 AM - 14:00 PM)"}<input value={form.horario} onChange={(e) => setForm({ ...form, horario: e.target.value })} /></label>
              <label>Hora Exacta<input value={form.hora_exacta} onChange={(e) => setForm({ ...form, hora_exacta: e.target.value })} placeholder="06:00 AM a 14:00 PM" /></label>
              <label>Días que Trabaja<input value={form.dias_trabajo} onChange={(e) => setForm({ ...form, dias_trabajo: e.target.value })} placeholder="Lunes a Viernes" /></label>
              <label>{t.specialtyLabel || "Especialidad"}<input value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} placeholder="Hipertrofia y Musculación" /></label>
              <label>{t.roleLabel || "Rol"}
                <select value={form.rol_id} onChange={(e) => setForm({ ...form, rol_id: e.target.value })} required>
                  <option value="">— Seleccionar —</option>
                  {roles.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                </select>
              </label>
              <label>{t.branchLabel || "Sucursal"}
                <select value={form.sucursal_id} onChange={(e) => setForm({ ...form, sucursal_id: e.target.value })}>
                  <option value="">— Ninguna —</option>
                  {sucursales.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>
              </label>
              <div className="sa-modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>{t.cancelBtn || "Cancelar"}</button>
                <button type="submit" className="sa-btn-primary">{t.saveBtn || "Crear"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffManager;
