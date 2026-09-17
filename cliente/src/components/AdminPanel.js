import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/auth";
import {
  FaUserPlus,
  FaSearch,
  FaEdit,
  FaTrashAlt,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaUserTag,
  FaDownload,
  FaArrowLeft,
  FaPhone,
  FaDumbbell,
  FaUserShield,
  FaBuilding,
  FaRocket,
  FaUsers,
  FaUserTie,
  FaIdCard,
  FaAppleAlt,
  FaCalculator,
  FaChartLine,
  FaThLarge
} from "react-icons/fa";
import "../styles/admin.css";

import SucursalesManager from "./SucursalesManager";
import RutinasManager from "./RutinasManager";
import EmprendedoresAdmin from "./EmprendedoresAdmin";
import StaffManager from "./StaffManager";
import {
  SuperAdminDashboard,
  GymAdminDashboard,
  RecepcionistaDashboard,
  EntrenadorDashboard,
  NutricionistaDashboard,
  ContadorDashboard,
  GerenteDashboard
} from "./RoleDashboards";

import { getTranslation } from "../translations";

const normalizePlan = (plan) => {
  if (!plan || !String(plan).trim()) return "";
  const value = String(plan).trim();
  if (value.toLowerCase() === "mensual") return "";
  return value;
};

const ROLES_LIST = [
  { slug: "superadmin", label: "Superadministrador", icon: FaUserShield, color: "#ff2a2a" },
  { slug: "admin_gym", label: "Administrador del Gimnasio", icon: FaUserTie, color: "#ff6b35" },
  { slug: "recepcionista", label: "Recepcionista", icon: FaIdCard, color: "#4ecdc4" },
  { slug: "entrenador", label: "Entrenador / Personal Trainer", icon: FaDumbbell, color: "#45b7d1" },
  { slug: "nutricionista", label: "Nutricionista", icon: FaAppleAlt, color: "#96ceb4" },
  { slug: "contador", label: "Contador / Finanzas", icon: FaCalculator, color: "#feca57" },
  { slug: "gerente", label: "Gerente", icon: FaChartLine, color: "#a29bfe" },
];

function AdminPanel({ selectedLanguage }) {
  const navigate = useNavigate();
  const locale = selectedLanguage?.code || "es";
  const t = getTranslation(locale, "admin");

  const [activeMainTab, setActiveMainTab] = useState("usuarios"); // usuarios, sucursales, rutinas, emprendedores, roles_consoles, staff
  const [selectedRoleConsole, setSelectedRoleConsole] = useState("superadmin");

  const [usuarios, setUsuarios] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [rutinas, setRutinas] = useState([]);
  const [staffList, setStaffList] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState("Todos");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [dbConnected, setDbConnected] = useState(false);
  const [notification, setNotification] = useState("🔓 Suite de Administración y Roles Activada");

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    telefono: "",
    plan: "",
    fecha: new Date().toISOString().split("T")[0],
    hora: new Date().toLocaleTimeString("es-EC", { hour12: false }),
    estado: "Activo",
    horario: "Tarde",
    observaciones: ""
  });

  useEffect(() => {
    const initAdmin = async () => {
      fetchUsuarios();
      fetchAuxData();
    };

    initAdmin();

    const timer = setTimeout(() => {
      setNotification("");
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const fetchAuxData = async () => {
    try {
      const resSuc = await apiFetch("/api/sucursales/public").catch(() => []);
      if (Array.isArray(resSuc)) setSucursales(resSuc);

      const resRut = await apiFetch("/api/rutinas/public").catch(() => []);
      if (Array.isArray(resRut)) setRutinas(resRut);

      const resStaff = await apiFetch("/api/staff").catch(() => []);
      if (Array.isArray(resStaff)) setStaffList(resStaff);
    } catch (e) {
      console.warn("Servidor offline para auxiliares");
    }
  };

  const fetchUsuarios = async () => {
    try {
      const data = await apiFetch("/api/admin/usuarios");
      if (Array.isArray(data)) {
        setDbConnected(true);
        const normalized = data.map((user) => ({
          ...user,
          plan: normalizePlan(user.plan),
        }));
        setUsuarios(normalized);
        localStorage.setItem("admin_usuarios", JSON.stringify(normalized));
        return;
      }
    } catch (error) {
      console.warn("Servidor Backend no disponible o error al obtener usuarios de MySQL:", error);
      setDbConnected(false);
    }

    const localData = localStorage.getItem("admin_usuarios");
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        const normalized = Array.isArray(parsed)
          ? parsed.map((user) => ({ ...user, plan: normalizePlan(user.plan) }))
          : [];
        setUsuarios(normalized);
        localStorage.setItem("admin_usuarios", JSON.stringify(normalized));
      } catch (e) {
        setUsuarios([]);
      }
    } else {
      const defaultUsers = [
        { id: 1, username: "admin", email: "admin@gym.com", telefono: "0987654321", plan: "Anual", estado: "Activo", fecha: "2026-08-26", hora: "08:00:00", observaciones: "Superadmin Principal" },
        { id: 2, username: "Carlos Cliente", email: "carlos@ejemplo.com", telefono: "0991112233", plan: "Trimestre", estado: "Activo", fecha: "2026-08-25", hora: "10:30:00", observaciones: "Entrenamiento mañana" }
      ];
      setUsuarios(defaultUsers);
      localStorage.setItem("admin_usuarios", JSON.stringify(defaultUsers));
    }
  };

  const saveToLocal = (newList) => {
    setUsuarios(newList);
    localStorage.setItem("admin_usuarios", JSON.stringify(newList));
  };

  const handleOpenAddModal = () => {
    setActiveMainTab("usuarios");
    const today = new Date();
    const fechaActual = today.toISOString().split("T")[0];
    const horaActual = today.toLocaleTimeString("es-EC", { hour12: false });

    setEditingUser(null);
    setFormData({
      username: "",
      email: "",
      telefono: "",
      plan: "",
      fecha: fechaActual,
      hora: horaActual,
      estado: "Activo",
      horario: "Tarde",
      observaciones: ""
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username || "",
      email: user.email || "",
      telefono: user.telefono || "",
      plan: normalizePlan(user.plan),
      fecha: user.fecha || new Date().toISOString().split("T")[0],
      hora: user.hora || "12:00:00",
      estado: user.estado || "Activo",
      horario: user.horario || "Tarde",
      observaciones: user.observaciones || ""
    });
    setShowModal(true);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro de MySQL?")) return;

    try {
      await apiFetch(`/api/admin/usuarios/${id}`, { method: "DELETE" });
      setNotification("🗑️ Registro de persona eliminado correctamente de MySQL.");
    } catch (e) {
      console.warn("Actualizando eliminación localmente", e);
      setNotification("🗑️ Registro de persona eliminado.");
    }

    const updated = usuarios.filter((u) => u.id !== id);
    saveToLocal(updated);
    fetchUsuarios();
    setTimeout(() => setNotification(""), 3000);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.email.trim()) {
      alert("Por favor completa el nombre de la persona y su correo electrónico.");
      return;
    }

    if (editingUser) {
      const updatedUser = { ...editingUser, ...formData };
      try {
        await apiFetch(`/api/admin/usuarios/${editingUser.id}`, {
          method: "PUT",
          body: JSON.stringify(updatedUser)
        });
        setNotification("✅ Datos actualizados correctamente en MySQL.");
      } catch (err) {
        console.warn("Error actualizando en backend:", err);
      }

      const newList = usuarios.map((u) => (u.id === editingUser.id ? updatedUser : u));
      saveToLocal(newList);
      fetchUsuarios();
    } else {
      let newUser = { id: Date.now(), ...formData };
      try {
        const resData = await apiFetch("/api/admin/usuarios", {
          method: "POST",
          body: JSON.stringify(newUser)
        });
        if (resData.user) newUser = { ...newUser, ...resData.user };
        setNotification("🎉 Registro creado exitosamente en MySQL.");
      } catch (err) {
        console.warn("Error creando en backend:", err);
      }

      const newList = [newUser, ...usuarios];
      saveToLocal(newList);
      fetchUsuarios();
    }

    setShowModal(false);
    setTimeout(() => setNotification(""), 3500);
  };

  const exportCSV = () => {
    const headers = ["ID", "Persona", "Email", "Telefono", "Plan", "Fecha", "Hora", "Estado", "Horario", "Observaciones"];
    const rows = usuarios.map(u => [
      u.id,
      `"${u.username || ""}"`,
      `"${u.email || ""}"`,
      `"${u.telefono || ""}"`,
      `"${u.plan || ""}"`,
      `"${u.fecha || ""}"`,
      `"${u.hora || ""}"`,
      `"${u.estado || ""}"`,
      `"${u.horario || ""}"`,
      `"${(u.observaciones || "").replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vendetta_administracion_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = usuarios.filter((u) => {
    const matchesSearch =
      (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.telefono && u.telefono.includes(searchTerm));

    const matchesPlan = filterPlan === "Todos" || (filterPlan === "Sin plan" ? !u.plan : u.plan === filterPlan);
    const matchesEstado = filterEstado === "Todos" || u.estado === filterEstado;

    return matchesSearch && matchesPlan && matchesEstado;
  });

  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter((u) => u.estado === "Activo").length;
  const usuariosPendientes = usuarios.filter((u) => u.estado === "Pendiente").length;

  return (
    <section className="admin-container">
      {/* Toast Notification */}
      {notification && (
        <div className="admin-toast">
          <span>{notification}</span>
          <button onClick={() => setNotification("")}>✕</button>
        </div>
      )}

      {/* Header */}
      <header className="admin-header">
        <div className="admin-title-group">
          <button className="back-btn" onClick={() => navigate("/")} title={t.backBtn || "Volver al Inicio"}>
            <FaArrowLeft /> {t.backBtn || "Volver al Inicio"}
          </button>
          <h1><FaUserShield className="admin-badge-icon" /> {t.title || "SUITE DE SUPERADMINISTRADOR Y ROLES"}</h1>
          <p>{t.subtitle || "Control unificado de personas, sucursales, rutinas por horarios, emprendedores y consolas por rol."}</p>
        </div>

        <div className="admin-header-actions">
          <button className="admin-cmd-board-btn" onClick={() => {
            setActiveMainTab("roles_consoles");
            setSelectedRoleConsole("superadmin");
          }}>
            <FaThLarge /> 🎛️ Tablero de Comandos
          </button>
          <button className="admin-action-btn primary-red-glow" onClick={handleOpenAddModal}>
            <FaUserPlus /> {t.registerPerson || "Registrar Persona"}
          </button>
          <button className="admin-action-btn secondary" onClick={exportCSV}>
            <FaDownload /> {t.exportReport || "Exportar Reporte"}
          </button>
        </div>
      </header>

      {/* Connection Status Banner */}
      <div className={`db-status-banner ${dbConnected ? "connected" : "disconnected"}`}>
        {dbConnected ? (
          <span>🟢 <strong>{t.dbConnected || "Conectado en tiempo real a la Base de Datos MySQL (bd: gym)"}</strong></span>
        ) : (
          <div className="db-offline-msg">
            <span>⚠️ <strong>{t.dbOffline || "Modo Local Offline Activo (Los cambios se guardan y persisten localmente con total funcionalidad)."}</strong></span>
          </div>
        )}
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="admin-master-tabs">
        <button className={activeMainTab === "usuarios" ? "active" : ""} onClick={() => setActiveMainTab("usuarios")}>
          <FaUsers /> {t.tabUsers || "Clientes & Personas"} ({totalUsuarios})
        </button>
        <button className={activeMainTab === "sucursales" ? "active" : ""} onClick={() => setActiveMainTab("sucursales")}>
          <FaBuilding /> {t.tabSucursales || "Sucursales"}
        </button>
        <button className={activeMainTab === "rutinas" ? "active" : ""} onClick={() => setActiveMainTab("rutinas")}>
          <FaDumbbell /> {t.tabRutinas || "Rutinas por Horarios"}
        </button>
        <button className={activeMainTab === "emprendedores" ? "active" : ""} onClick={() => setActiveMainTab("emprendedores")}>
          <FaRocket /> {t.tabEmprendedores || "Solicitudes de Emprendedores"}
        </button>
        <button className={activeMainTab === "roles_consoles" ? "active" : ""} onClick={() => setActiveMainTab("roles_consoles")}>
          <FaUserShield /> {t.tabRolesConsoles || "Consolas de los 7 Roles"}
        </button>
        <button className={activeMainTab === "staff" ? "active" : ""} onClick={() => setActiveMainTab("staff")}>
          <FaUserTie /> {t.tabStaff || "Personal & Staff"}
        </button>
      </div>

      {/* TAB 1: USUARIOS Y CLIENTES */}
      {activeMainTab === "usuarios" && (
        <>
          <div className="admin-metrics-grid">
            <div className="metric-card">
              <div className="metric-icon users-icon"><FaUserTag /></div>
              <div className="metric-info">
                <h3>{t.metricTotalUsers || "Total Personas"}</h3>
                <h2>{totalUsuarios}</h2>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon active-icon"><FaCheckCircle /></div>
              <div className="metric-info">
                <h3>{t.metricActiveUsers || "Membresías Activas"}</h3>
                <h2>{usuariosActivos}</h2>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon pending-icon"><FaClock /></div>
              <div className="metric-info">
                <h3>{t.metricPendingUsers || "Pagos Pendientes"}</h3>
                <h2>{usuariosPendientes}</h2>
              </div>
            </div>
          </div>

          <div className="admin-toolbar">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder={t.searchPlaceholder || "Buscar por persona, correo o teléfono..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filters-wrapper">
              <div className="filter-box">
                <label>{t.filterPlan || "Plan:"}</label>
                <select value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)}>
                  <option value="Todos">{t.allPlans || "Todos los Planes"}</option>
                  <option value="Sin plan">{t.noPlan || "Sin plan"}</option>
                  <option value="Diario">Diario</option>
                  <option value="JABA">JABA</option>
                  <option value="Mensual">Mensual</option>
                  <option value="Trimestre">Trimestre</option>
                  <option value="Anual">Anual</option>
                </select>
              </div>

              <div className="filter-box">
                <label>{t.filterStatus || "Estado:"}</label>
                <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
                  <option value="Todos">{t.allStatus || "Todos"}</option>
                  <option value="Activo">{t.activeStatus || "Activo"}</option>
                  <option value="Pendiente">{t.pendingStatus || "Pendiente"}</option>
                  <option value="Vencido">{t.expiredStatus || "Vencido"}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{t.thId || "ID"}</th>
                  <th>{t.thPerson || "Persona / Cliente"}</th>
                  <th>{t.thContact || "Contacto"}</th>
                  <th>{t.thPlan || "Plan de Membresía"}</th>
                  <th><FaCalendarAlt /> {t.thDate || "Fecha"}</th>
                  <th><FaClock /> {t.thTime || "Hora"}</th>
                  <th>{t.thStatus || "Estado"}</th>
                  <th>{t.thObs || "Observaciones"}</th>
                  <th>{t.thActions || "Acciones"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="user-id">#{user.id}</td>
                      <td className="user-name">
                        <div className="user-avatar-circle">
                          {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <strong>{user.username}</strong>
                          <div className="user-subtext">{user.horario || "Tarde"}</div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-cell">
                          <span>{user.email}</span>
                          {user.telefono && <small className="phone-sub"><FaPhone className="mini-icon" /> {user.telefono}</small>}
                        </div>
                      </td>
                      <td className="plan-cell">
                        {normalizePlan(user.plan) ? (
                          <span className={`plan-tag ${normalizePlan(user.plan).toLowerCase()}`}>
                            {normalizePlan(user.plan)}
                          </span>
                        ) : null}
                      </td>
                      <td><strong className="date-highlight">{user.fecha || "N/A"}</strong></td>
                      <td><span className="time-highlight">{user.hora || "N/A"}</span></td>
                      <td>
                        <span className={`status-pill ${user.estado ? user.estado.toLowerCase() : "activo"}`}>
                          {user.estado === "Activo" ? (t.activeStatus || "Activo") : user.estado === "Pendiente" ? (t.pendingStatus || "Pendiente") : user.estado === "Vencido" ? (t.expiredStatus || "Vencido") : (user.estado || "Activo")}
                        </span>
                      </td>
                      <td className="obs-cell">{user.observaciones || "-"}</td>
                      <td className="table-actions">
                        <button
                          className="btn-icon edit-btn"
                          onClick={() => handleOpenEditModal(user)}
                          title={t.modalEditTitle || "Editar datos"}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-icon delete-btn"
                          onClick={() => handleDeleteUser(user.id)}
                          title={t.confirmDelete || "Eliminar registro"}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="empty-table">
                      {t.noUsersFound || "No se encontraron registros con los filtros seleccionados."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* TAB 2: SUCURSALES */}
      {activeMainTab === "sucursales" && (
        <div className="tab-section-wrapper">
          <SucursalesManager selectedLanguage={selectedLanguage} />
        </div>
      )}

      {/* TAB 3: RUTINAS Y HORARIOS */}
      {activeMainTab === "rutinas" && (
        <div className="tab-section-wrapper">
          <RutinasManager selectedLanguage={selectedLanguage} />
        </div>
      )}

      {/* TAB 4: EMPRENDEDORES */}
      {activeMainTab === "emprendedores" && (
        <div className="tab-section-wrapper">
          <EmprendedoresAdmin selectedLanguage={selectedLanguage} />
        </div>
      )}

      {/* TAB 5: CONSOLAS DE LOS 7 ROLES */}
      {activeMainTab === "roles_consoles" && (
        <div className="tab-section-wrapper">
          <div className="role-selector-bar">
            <h3>{t.selectRole || "Seleccionar Vista de Rol Principal:"}</h3>
            <div className="role-buttons-grid">
              {ROLES_LIST.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.slug}
                    className={`role-select-btn ${selectedRoleConsole === r.slug ? "active" : ""}`}
                    onClick={() => setSelectedRoleConsole(r.slug)}
                    style={{ borderTopColor: r.color }}
                  >
                    <Icon style={{ color: r.color }} />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="role-active-view">
            {selectedRoleConsole === "superadmin" && (
              <SuperAdminDashboard
                selectedLanguage={selectedLanguage}
                usuarios={usuarios}
                sucursales={sucursales}
                rutinas={rutinas}
                staff={staffList}
                onRefresh={fetchUsuarios}
              />
            )}
            {selectedRoleConsole === "admin_gym" && (
              <GymAdminDashboard
                selectedLanguage={selectedLanguage}
                usuarios={usuarios}
                sucursales={sucursales}
                onAddUser={handleOpenAddModal}
              />
            )}
            {selectedRoleConsole === "recepcionista" && (
              <RecepcionistaDashboard selectedLanguage={selectedLanguage} usuarios={usuarios} />
            )}
            {selectedRoleConsole === "entrenador" && (
              <EntrenadorDashboard selectedLanguage={selectedLanguage} usuarios={usuarios} rutinas={rutinas} />
            )}
            {selectedRoleConsole === "nutricionista" && (
              <NutricionistaDashboard selectedLanguage={selectedLanguage} usuarios={usuarios} />
            )}
            {selectedRoleConsole === "contador" && (
              <ContadorDashboard selectedLanguage={selectedLanguage} />
            )}
            {selectedRoleConsole === "gerente" && (
              <GerenteDashboard selectedLanguage={selectedLanguage} usuarios={usuarios} sucursales={sucursales} />
            )}
          </div>
        </div>
      )}

      {/* TAB 6: STAFF Y PERMISOS */}
      {activeMainTab === "staff" && (
        <div className="tab-section-wrapper">
          <StaffManager selectedLanguage={selectedLanguage} />
        </div>
      )}

      {/* Modal for User Create / Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? "Editar Persona" : "Registrar Nueva Persona"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmitForm} className="admin-form">
              <div className="form-group">
                <label>Nombre y Apellidos *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Juan Pérez"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="juan@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    placeholder="0987654321"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Plan Contratado</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  >
                    <option value="">Sin plan</option>
                    <option value="Diario">Diario</option>
                    <option value="JABA">JABA</option>
                    <option value="Mensual">Mensual</option>
                    <option value="Trimestre">Trimestre</option>
                    <option value="Anual">Anual</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Vencido">Vencido</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de Registro</label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Hora de Registro</label>
                  <input
                    type="time"
                    step="1"
                    value={formData.hora}
                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Observaciones</label>
                <textarea
                  rows="3"
                  placeholder="Detalles sobre el pago, sucursal preferida o rutinas..."
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">
                  {editingUser ? "Guardar Cambios" : "Registrar Persona"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminPanel;
