import React, { useState } from "react";
import {
  FaUserShield,
  FaUserTie,
  FaIdCard,
  FaDumbbell,
  FaAppleAlt,
  FaCalculator,
  FaChartLine,
  FaUsers,
  FaCheckCircle,
  FaDollarSign,
  FaFileInvoiceDollar,
  FaHeartbeat,
  FaBuilding,
  FaPlus,
  FaSearch,
  FaSync,
  FaClipboardList,
  FaPrint,
  FaEye
} from "react-icons/fa";
import { ROLES_INFO } from "../utils/auth";
import { getTranslation } from "../translations";
import "../styles/roleDashboards.css";

export function SuperAdminDashboard({ selectedLanguage, usuarios = [], sucursales = [], rutinas = [], staff = [], onRefresh }) {
  const locale = selectedLanguage?.code || "es";
  const t = getTranslation(locale, "roleDashboards");
  const [activeTab, setActiveTab] = useState("tablero_comando");
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);
  const [cmdSearch, setCmdSearch] = useState("");
  const [cmdCategory, setCmdCategory] = useState("all");

  const rawTrainers = (staff && staff.length > 0)
    ? staff.filter(s => s.rol === "entrenador" || (s.username && s.username.toLowerCase().includes("entrenad")))
    : [];

  const trainersList = rawTrainers.length > 0
    ? rawTrainers.map((t, idx) => ({
        id: t.id || idx + 1,
        username: t.username,
        email: t.email || "entrenador@gym.com",
        telefono: t.telefono || "0991234567",
        rol: "entrenador",
        rol_nombre: t.rol_nombre || "Entrenador / Personal Trainer",
        horario: t.horario || (idx % 2 === 0 ? "06:00 AM - 14:00 PM" : "14:00 PM - 22:00 PM"),
        hora_exacta: t.hora_exacta || (idx % 2 === 0 ? "06:00 AM a 14:00 PM (Turno Mañana)" : "14:00 PM a 22:00 PM (Turno Tarde)"),
        fecha_ingreso: t.fecha_ingreso || "2026-01-15",
        dias_trabajo: t.dias_trabajo || (idx % 2 === 0 ? "Lunes a Viernes" : "Lunes, Miércoles y Viernes"),
        especialidad: t.especialidad || (idx % 2 === 0 ? "Hipertrofia, Musculación & Fuerza" : "Entrenamiento Funcional & HIIT"),
        sucursal_nombre: t.sucursal_nombre || "Vendetta Fitness Matriz",
        estado: t.estado || "Activo - En turno"
      }))
    : [
        {
          id: 101,
          username: "Carlos Mendoza (Entrenador Principal)",
          email: "carlos.mendoza@gym.com",
          telefono: "0991234567",
          rol: "entrenador",
          rol_nombre: "Entrenador / Personal Trainer",
          horario: "06:00 AM - 14:00 PM",
          hora_exacta: "06:00 AM a 14:00 PM (Turno Mañana)",
          fecha_ingreso: "2026-01-10",
          dias_trabajo: "Lunes a Viernes",
          especialidad: "Hipertrofia, Musculación & Personal Trainer",
          sucursal_nombre: "Vendetta Fitness Industry (Matriz)",
          estado: "Activo - En turno"
        },
        {
          id: 102,
          username: "María Fernández (Entrenadora de Funcional)",
          email: "maria.fernandez@gym.com",
          telefono: "0997654321",
          rol: "entrenador",
          rol_nombre: "Entrenador / Personal Trainer",
          horario: "14:00 PM - 22:00 PM",
          hora_exacta: "14:00 PM a 22:00 PM (Turno Tarde)",
          fecha_ingreso: "2026-02-01",
          dias_trabajo: "Lunes a Sábado",
          especialidad: "Entrenamiento Funcional, HIIT & Cardio",
          sucursal_nombre: "Vendetta Fitness Industry (Matriz)",
          estado: "Activo - En turno"
        },
        {
          id: 103,
          username: "Alex Fitness (Entrenador de CrossFit)",
          email: "alex.fitness@gym.com",
          telefono: "0998887766",
          rol: "entrenador",
          rol_nombre: "Entrenador / Personal Trainer",
          horario: "08:00 AM - 16:00 PM",
          hora_exacta: "08:00 AM a 16:00 PM (Turno Intermedio)",
          fecha_ingreso: "2026-01-20",
          dias_trabajo: "Lunes, Miércoles y Viernes",
          especialidad: "CrossFit, Fuerza de Potencia y Calistenia",
          sucursal_nombre: "Vendetta Fitness Sur",
          estado: "Activo"
        }
      ];

  const fallbackUsers = (usuarios && usuarios.length > 0) ? usuarios : [
    { id: 1, username: "Mateo Silva", email: "mateo.silva@ejemplo.com", telefono: "0991234567", rol: "cliente_vip", rol_nombre: "Cliente VIP Gold", sucursal_nombre: "Vendetta Fitness Matriz", estado: "Activo", membresia: "Plan Anual Black Box" },
    { id: 2, username: "Andrés Torres", email: "andres.torres@ejemplo.com", telefono: "0987654321", rol: "superadmin", rol_nombre: "Superadministrador", sucursal_nombre: "Vendetta Fitness Matriz", estado: "Activo / Root", membresia: "Licencia Master System" },
    { id: 3, username: "Sofía López", email: "sofia.lopez@ejemplo.com", telefono: "0993334455", rol: "recepcionista", rol_nombre: "Recepcionista / Atacante", sucursal_nombre: "Vendetta Fitness Sur", estado: "En Turno", membresia: "Staff Interno" },
    { id: 4, username: "Juan Pérez", email: "juan.perez@ejemplo.com", telefono: "0994445566", rol: "cliente_standard", rol_nombre: "Cliente Standard", sucursal_nombre: "Vendetta Fitness Norte", estado: "Activo", membresia: "Plan Trimestral Fit" },
    { id: 5, username: "Elena Gómez", email: "elena.gomez@ejemplo.com", telefono: "0995556677", rol: "nutricionista", rol_nombre: "Nutricionista Principal", sucursal_nombre: "Vendetta Fitness Matriz", estado: "En Consulta", membresia: "Staff Nutrición" },
    { id: 6, username: "Diego Ramírez", email: "diego.ramirez@ejemplo.com", telefono: "0996667788", rol: "contador", rol_nombre: "Contador / Finanzas", sucursal_nombre: "Vendetta Fitness Matriz", estado: "Activo", membresia: "Staff Financiero" },
    { id: 7, username: "Camila Viteri", email: "camila.viteri@ejemplo.com", telefono: "0997778899", rol: "gerente", rol_nombre: "Gerente General", sucursal_nombre: "Vendetta Fitness Matriz", estado: "Activo", membresia: "Staff Directivo" }
  ];

  const consolidatedTrainers = trainersList.map((tr, idx) => ({
    type: "entrenador",
    typeLabel: "🏋️ ENTRENADOR",
    id: `trainer_${tr.id || idx}`,
    nombre: tr.username,
    email: tr.email || "entrenador@gym.com",
    telefono: tr.telefono || "0991234567",
    rol: "entrenador",
    rol_nombre: tr.rol_nombre || "Entrenador / Personal Trainer",
    sucursal: tr.sucursal_nombre || "Vendetta Fitness Matriz",
    horario: tr.hora_exacta || tr.horario || "06:00 AM - 14:00 PM",
    dias_trabajo: tr.dias_trabajo || "Lunes a Viernes",
    especialidad: tr.especialidad || "Musculación & Personal Trainer",
    estado: tr.estado || "Activo - En turno"
  }));

  const consolidatedUsers = fallbackUsers.map((u, idx) => ({
    type: u.rol === "superadmin" ? "admin" : (u.rol && u.rol.includes("cliente") ? "usuario" : "staff"),
    typeLabel: u.rol === "superadmin" ? "🛡️ SUPERADMIN" : ((u.rol && u.rol.includes("cliente")) ? "👥 CLIENTE" : "💼 STAFF"),
    id: `user_${u.id || idx}`,
    nombre: u.username || u.nombre,
    email: u.email || `${(u.username || "user").toLowerCase().replace(/\s+/g, "")}@ejemplo.com`,
    telefono: u.telefono || "0991234567",
    rol: u.rol || "cliente",
    rol_nombre: u.rol_nombre || (u.rol === "superadmin" ? "Superadministrador" : "Cliente de Gimnasio"),
    sucursal: u.sucursal_nombre || "Vendetta Fitness Matriz",
    horario: u.membresia || "Acceso General",
    dias_trabajo: "Lunes a Domingo",
    especialidad: u.membresia || "Membresía Activa",
    estado: u.estado || "Activo"
  }));

  const allConsolidatedItems = [...consolidatedTrainers, ...consolidatedUsers];

  const filteredItems = allConsolidatedItems.filter((item) => {
    const matchesCat = cmdCategory === "all" ||
      (cmdCategory === "entrenadores" && item.type === "entrenador") ||
      (cmdCategory === "usuarios" && item.type === "usuario") ||
      (cmdCategory === "staff" && (item.type === "staff" || item.type === "admin"));

    const query = cmdSearch.toLowerCase();
    const matchesQuery = !query ||
      item.nombre.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.telefono.toLowerCase().includes(query) ||
      item.rol_nombre.toLowerCase().includes(query) ||
      item.sucursal.toLowerCase().includes(query) ||
      item.especialidad.toLowerCase().includes(query);

    return matchesCat && matchesQuery;
  });

  return (
    <div className="role-db-container">
      <div className="role-db-header superadmin">
        <div>
          <h2><FaUserShield /> Consola de Superadministrador</h2>
          <p>Control total del sistema: Tablero de Comando Global, Entrenadores, Permisos RBAC, Usuarios y Auditoría.</p>
        </div>
        <div className="sa-header-actions">
          <button className="role-cmd-board-btn" onClick={() => setActiveTab("tablero_comando")}>
            🎛️ Tablero de Comando Total (Ver Todo)
          </button>
          <button className="role-refresh-btn" onClick={onRefresh}><FaSync /> Actualizar Todo</button>
        </div>
      </div>

      <div className="role-stats-bar">
        <div className="stat-pill">
          <FaUsers />
          <div>
            <span>Total Usuarios</span>
            <strong>{consolidatedUsers.length}</strong>
          </div>
        </div>
        <div className="stat-pill">
          <FaDumbbell />
          <div>
            <span>Entrenadores Activos</span>
            <strong>{trainersList.length}</strong>
          </div>
        </div>
        <div className="stat-pill">
          <FaBuilding />
          <div>
            <span>Sucursales Activas</span>
            <strong>{(sucursales || []).length}</strong>
          </div>
        </div>
        <div className="stat-pill">
          <FaUserTie />
          <div>
            <span>Personal / Staff</span>
            <strong>{staff ? staff.length : 4}</strong>
          </div>
        </div>
      </div>

      <div className="role-tab-nav">
        <button className={activeTab === "tablero_comando" ? "active" : ""} onClick={() => setActiveTab("tablero_comando")}>
          🎛️ Tablero de Comando (Ver Todo)
        </button>
        <button className={activeTab === "entrenadores" ? "active" : ""} onClick={() => setActiveTab("entrenadores")}>
          🏋️ Entrenadores (Exclusivo Superadmin)
        </button>
        <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
          Resumen Global
        </button>
        <button className={activeTab === "roles" ? "active" : ""} onClick={() => setActiveTab("roles")}>
          Roles y Permisos
        </button>
        <button className={activeTab === "audit" ? "active" : ""} onClick={() => setActiveTab("audit")}>
          Logs & Auditoría
        </button>
      </div>

      {activeTab === "tablero_comando" && (
        <div className="role-content-box cmd-board-content-box">
          <div className="cmd-board-top-banner">
            <div>
              <h3>🎛️ Tablero de Comando Central — Consola Master</h3>
              <p>Visualización unificada de todo el ecosistema: Usuarios, Entrenadores, Roles, Sucursales y Contacto.</p>
            </div>
            <button className="cmd-print-btn" onClick={() => window.print()}>
              <FaPrint /> Imprimir Tablero (PDF)
            </button>
          </div>

          <div className="cmd-controls-bar">
            <div className="cmd-search-input-box">
              <FaSearch className="search-ico" />
              <input
                type="text"
                placeholder="Buscar por usuario, entrenador, correo, teléfono, rol o sucursal..."
                value={cmdSearch}
                onChange={(e) => setCmdSearch(e.target.value)}
              />
            </div>

            <div className="cmd-cat-pills">
              <button className={cmdCategory === "all" ? "active" : ""} onClick={() => setCmdCategory("all")}>
                🌐 Ver Todo ({allConsolidatedItems.length})
              </button>
              <button className={cmdCategory === "entrenadores" ? "active" : ""} onClick={() => setCmdCategory("entrenadores")}>
                🏋️ Entrenadores ({consolidatedTrainers.length})
              </button>
              <button className={cmdCategory === "usuarios" ? "active" : ""} onClick={() => setCmdCategory("usuarios")}>
                👥 Clientes ({consolidatedUsers.filter(u => u.type === "usuario").length})
              </button>
              <button className={cmdCategory === "staff" ? "active" : ""} onClick={() => setCmdCategory("staff")}>
                💼 Staff & Admins ({consolidatedUsers.filter(u => u.type !== "usuario").length})
              </button>
            </div>
          </div>

          <div className="cmd-master-table-wrapper">
            <table className="cmd-master-table">
              <thead>
                <tr>
                  <th>TIPO / CATEGORÍA</th>
                  <th>NOMBRE Y USUARIO</th>
                  <th>CORREO ELECTRÓNICO</th>
                  <th>TELÉFONO</th>
                  <th>ROL ASIGNADO</th>
                  <th>HORARIO / TURNO / MEMBRESÍA</th>
                  <th>SUCURSAL</th>
                  <th>ESTADO</th>
                  <th>DETALLE</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className={`cmd-tr-${item.type}`}>
                    <td>
                      <span className={`cmd-type-tag tag-${item.type}`}>{item.typeLabel}</span>
                    </td>
                    <td>
                      <strong className="cmd-user-title">{item.nombre}</strong>
                    </td>
                    <td>{item.email}</td>
                    <td>
                      <span className="cmd-phone-highlight">📞 {item.telefono}</span>
                    </td>
                    <td>
                      <span className="cmd-role-badge">{item.rol_nombre}</span>
                    </td>
                    <td>{item.horario}</td>
                    <td>{item.sucursal}</td>
                    <td>
                      <span className="cmd-status-pill">{item.estado}</span>
                    </td>
                    <td>
                      <button className="cmd-view-btn" onClick={() => setSelectedItemDetail(item)}>
                        <FaEye /> Ficha
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MODAL DETALLE DE FICHA TOTAL */}
          {selectedItemDetail && (
            <div className="sa-trainer-modal-overlay" onClick={() => setSelectedItemDetail(null)}>
              <div className="sa-trainer-modal cmd-item-modal" onClick={(e) => e.stopPropagation()}>
                <div className="sa-modal-head">
                  <h3>🎛️ Ficha de Control — {selectedItemDetail.nombre}</h3>
                  <button className="sa-modal-close-btn" onClick={() => setSelectedItemDetail(null)}>✕</button>
                </div>

                <div className="sa-trainer-detail-body">
                  <div className="detail-badge-top">
                    <span className="badge-tag">{selectedItemDetail.typeLabel}</span>
                    <span className="badge-status">{selectedItemDetail.estado}</span>
                  </div>

                  <div className="detail-fields-grid">
                    <div className="detail-field">
                      <label>👤 Nombre Completo / Usuario</label>
                      <div className="detail-val-text">{selectedItemDetail.nombre}</div>
                    </div>

                    <div className="detail-field highlight-box">
                      <label>🛡️ Rol Asignado</label>
                      <div className="detail-val-text bold-red">{selectedItemDetail.rol_nombre}</div>
                    </div>

                    <div className="detail-field">
                      <label>📧 Correo Electrónico</label>
                      <div className="detail-val-text">{selectedItemDetail.email}</div>
                    </div>

                    <div className="detail-field highlight-box">
                      <label>📞 Número de Teléfono / WhatsApp</label>
                      <div className="detail-val-text bold-red">{selectedItemDetail.telefono}</div>
                    </div>

                    <div className="detail-field">
                      <label>⏰ Horario / Turno / Plan</label>
                      <div className="detail-val-text">{selectedItemDetail.horario}</div>
                    </div>

                    <div className="detail-field">
                      <label>🗓️ Días Laborales / Días de Acceso</label>
                      <div className="detail-val-text">{selectedItemDetail.dias_trabajo}</div>
                    </div>

                    <div className="detail-field">
                      <label>💪 Especialidad / Membresía</label>
                      <div className="detail-val-text">{selectedItemDetail.especialidad}</div>
                    </div>

                    <div className="detail-field">
                      <label>🏢 Sucursal Asignada</label>
                      <div className="detail-val-text">{selectedItemDetail.sucursal}</div>
                    </div>
                  </div>
                </div>

                <div className="sa-modal-foot">
                  <button className="sa-btn-close-modal" onClick={() => setSelectedItemDetail(null)}>
                    Cerrar Ficha
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "entrenadores" && (
        <div className="role-content-box">
          <div className="sa-trainer-header-bar">
            <div>
              <h3>🏋️ {t.trainersTab || "Gestión e Información de Entrenadores"}</h3>
              <p style={{ color: "#aaa", fontSize: "14px", margin: "4px 0 0 0" }}>
                Visualización exclusiva para Superadministrador: Nombres de entrenadores, sus horarios de trabajo y espacio detallado de "{t.moreInfoBtn || "Más información"}".
              </p>
            </div>
          </div>

          <div className="trainers-superadmin-grid">
            {trainersList.map((trainer) => (
              <div key={trainer.id} className="trainer-sa-card">
                <div className="trainer-card-header">
                  <div className="trainer-avatar-badge">💪</div>
                  <div>
                    <h4>{trainer.username}</h4>
                    <span className="trainer-role-sub">{trainer.rol_nombre || "Entrenador / Personal Trainer"}</span>
                  </div>
                </div>

                <div className="trainer-card-body">
                  <div className="trainer-info-row">
                    <span className="info-label">⏱️ Horario de Trabajo:</span>
                    <strong className="info-val-highlight">{trainer.horario}</strong>
                  </div>
                  <div className="trainer-info-row">
                    <span className="info-label">🏢 Sucursal:</span>
                    <span>{trainer.sucursal_nombre}</span>
                  </div>
                  <div className="trainer-info-row">
                    <span className="info-label">🗓️ Días que Trabaja:</span>
                    <span>{trainer.dias_trabajo}</span>
                  </div>
                </div>

                <div className="trainer-card-footer">
                  <button
                    className="sa-more-info-btn"
                    onClick={() => setSelectedTrainer(trainer)}
                  >
                    ℹ️ Más información
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ESPACIO MODAL DE MÁS INFORMACIÓN */}
          {selectedTrainer && (
            <div className="sa-trainer-modal-overlay" onClick={() => setSelectedTrainer(null)}>
              <div className="sa-trainer-modal" onClick={(e) => e.stopPropagation()}>
                <div className="sa-modal-head">
                  <h3>🏋️ Información Detallada del Entrenador</h3>
                  <button className="sa-modal-close-btn" onClick={() => setSelectedTrainer(null)}>✕</button>
                </div>

                <div className="sa-trainer-detail-body">
                  <div className="detail-badge-top">
                    <span className="badge-tag">{selectedTrainer.rol_nombre}</span>
                    <span className="badge-status">{selectedTrainer.estado}</span>
                  </div>

                  <div className="detail-fields-grid">
                    <div className="detail-field">
                      <label>👤 Nombre del Entrenador</label>
                      <div className="detail-val-text">{selectedTrainer.username}</div>
                    </div>

                    <div className="detail-field highlight-box">
                      <label>⏰ Hora Exacta / Turno</label>
                      <div className="detail-val-text bold-red">{selectedTrainer.hora_exacta || selectedTrainer.horario}</div>
                    </div>

                    <div className="detail-field">
                      <label>📅 Fecha de Ingreso / Registro</label>
                      <div className="detail-val-text">{selectedTrainer.fecha_ingreso}</div>
                    </div>

                    <div className="detail-field highlight-box">
                      <label>🗓️ Días que Trabaja</label>
                      <div className="detail-val-text bold-red">{selectedTrainer.dias_trabajo}</div>
                    </div>

                    <div className="detail-field">
                      <label>💪 Especialidad / Área</label>
                      <div className="detail-val-text">{selectedTrainer.especialidad}</div>
                    </div>

                    <div className="detail-field">
                      <label>🏢 Sucursal Asignada</label>
                      <div className="detail-val-text">{selectedTrainer.sucursal_nombre}</div>
                    </div>

                    <div className="detail-field">
                      <label>📞 Teléfono de Contacto</label>
                      <div className="detail-val-text">{selectedTrainer.telefono}</div>
                    </div>

                    <div className="detail-field">
                      <label>📧 Correo Electrónico</label>
                      <div className="detail-val-text">{selectedTrainer.email}</div>
                    </div>
                  </div>
                </div>

                <div className="sa-modal-foot">
                  <button className="sa-btn-close-modal" onClick={() => setSelectedTrainer(null)}>
                    Cerrar Detalle
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "overview" && (
        <div className="role-content-box">
          <h3>Módulos de Sistema Bajo Control</h3>
          <div className="superadmin-modules-grid">
            <div className="sa-mod-card">
              <h4>🏢 Sucursales y Expansión</h4>
              <p>{(sucursales || []).length} sucursal(es) registradas con horarios de atención y matriz central.</p>
            </div>
            <div className="sa-mod-card">
              <h4>👥 Roles y Usuarios</h4>
              <p>7 Roles activos en el sistema con matriz de permisos RBAC dinámicos.</p>
            </div>
            <div className="sa-mod-card">
              <h4>🏋️ Entrenadores y Horarios</h4>
              <p>Control exclusivo de entrenadores, sus horas exactas, fechas y días laborales.</p>
            </div>
            <div className="sa-mod-card">
              <h4>💰 Finanzas y Facturación</h4>
              <p>Seguimiento de ingresos por membresías, cobros en recepción y balances generales.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "roles" && (
        <div className="role-content-box">
          <h3>Matriz de Permisos por Rol</h3>
          <div className="roles-summary-grid">
            {Object.keys(ROLES_INFO).map((key) => (
              <div key={key} className="role-card-mini" style={{ borderLeftColor: ROLES_INFO[key].color }}>
                <span className="role-tag-badge" style={{ backgroundColor: ROLES_INFO[key].color }}>
                  {ROLES_INFO[key].label}
                </span>
                <p className="role-slug-code">Slug: <code>{key}</code></p>
                <small>Permisos configurados e integrados dinámicamente.</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="role-content-box">
          <h3>Registro de Auditoría de Sistema</h3>
          <ul className="audit-log-list">
            <li>🟢 <strong>Superadmin</strong> inició sesión correctamente desde la consola central.</li>
            <li>🟢 Sincronización realizada con la base de datos MySQL <code>gym</code>.</li>
            <li>🟢 Módulo exclusivo de <strong>Entrenadores (Horarios, Horas, Fechas y Días de Trabajo)</strong> activo.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export function GymAdminDashboard({ selectedLanguage, usuarios = [], sucursales = [], onAddUser }) {
  const locale = selectedLanguage?.code || "es";
  const t = getTranslation(locale, "roleDashboards");
  return (
    <div className="role-db-container">
      <div className="role-db-header admin_gym">
        <div>
          <h2><FaUserTie /> {t.gymAdminTitle || "Consola de Administrador del Gimnasio"}</h2>
          <p>Gestión operativa del gimnasio: Administración de clientes, empleados, membresías, pagos y reportes generales.</p>
        </div>
        <button className="role-action-btn" onClick={onAddUser}><FaPlus /> Registrar Nuevo Cliente</button>
      </div>

      <div className="role-metrics-three">
        <div className="role-metric-card">
          <FaUsers className="metric-ico" />
          <div>
            <h4>Clientes Totales</h4>
            <h3>{(usuarios || []).length}</h3>
          </div>
        </div>
        <div className="role-metric-card">
          <FaCheckCircle className="metric-ico" />
          <div>
            <h4>Membresías Activas</h4>
            <h3>{(usuarios || []).filter((u) => u.estado === "Activo").length}</h3>
          </div>
        </div>
        <div className="role-metric-card">
          <FaBuilding className="metric-ico" />
          <div>
            <h4>Sucursales Operativas</h4>
            <h3>{(sucursales || []).length}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecepcionistaDashboard({ selectedLanguage, usuarios = [] }) {
  const locale = selectedLanguage?.code || "es";
  const t = getTranslation(locale, "roleDashboards");
  const [checkinSuccess, setCheckinSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCheckin = (usuarioNombre, tipo) => {
    const time = new Date().toLocaleTimeString("es-EC");
    setCheckinSuccess(`✅ Check-${tipo} registrado para ${usuarioNombre} a las ${time}`);
    setTimeout(() => setCheckinSuccess(""), 4000);
  };

  const filtered = (usuarios || []).filter(
    (u) =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="role-db-container">
      <div className="role-db-header recepcionista">
        <div>
          <h2><FaIdCard /> {t.receptionistTitle || "Consola de Recepcionista"}</h2>
          <p>Módulo interactivo para Check-In / Check-Out de clientes, inscripción de membresías y cobros básicos.</p>
        </div>
      </div>

      {checkinSuccess && <div className="role-alert-success">{checkinSuccess}</div>}

      <div className="role-content-box">
        <div className="reception-toolbar">
          <div className="search-input-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Buscar cliente por nombre o correo para Check-In..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="role-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Plan</th>
              <th>Estado</th>
              <th>Acciones de Entrada / Salida</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 10).map((u) => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td><strong>{u.username}</strong><br /><small>{u.email}</small></td>
                <td><span className="role-badge-plan">{u.plan || "Sin plan"}</span></td>
                <td>
                  <span className={`role-status-chip ${u.estado?.toLowerCase() || "activo"}`}>
                    {u.estado || "Activo"}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="btn-checkin" onClick={() => handleCheckin(u.username, "Entrada")}>
                    🟢 Registrar Entrada
                  </button>
                  <button className="btn-checkout" onClick={() => handleCheckin(u.username, "Salida")}>
                    🔴 Registrar Salida
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function EntrenadorDashboard({ selectedLanguage, usuarios = [], rutinas = [] }) {
  const locale = selectedLanguage?.code || "es";
  const t = getTranslation(locale, "roleDashboards");
  const [selectedClient, setSelectedClient] = useState("");
  const [measurements, setMeasurements] = useState({ pecho: "", cintura: "", brazo: "", pierna: "", notas: "" });
  const [history, setHistory] = useState([
    { fecha: "2026-08-20", usuario: "Cliente Demo", pecho: "102 cm", cintura: "84 cm", brazo: "38 cm", pierna: "58 cm" }
  ]);
  const [msg, setMsg] = useState("");

  const handleSaveMeasurement = (e) => {
    e.preventDefault();
    if (!selectedClient) {
      alert("Por favor selecciona un cliente asignado.");
      return;
    }
    const newEntry = {
      fecha: new Date().toISOString().split("T")[0],
      usuario: selectedClient,
      pecho: measurements.pecho ? `${measurements.pecho} cm` : "—",
      cintura: measurements.cintura ? `${measurements.cintura} cm` : "—",
      brazo: measurements.brazo ? `${measurements.brazo} cm` : "—",
      pierna: measurements.pierna ? `${measurements.pierna} cm` : "—",
    };
    setHistory([newEntry, ...history]);
    setMsg("✅ Medidas de progreso guardadas exitosamente.");
    setMeasurements({ pecho: "", cintura: "", brazo: "", pierna: "", notas: "" });
    setTimeout(() => setMsg(""), 3500);
  };

  return (
    <div className="role-db-container">
      <div className="role-db-header entrenador">
        <div>
          <h2><FaDumbbell /> {t.trainerTitle || "Consola de Entrenador / Personal Trainer"}</h2>
          <p>Consulta clientes asignados, administra rutinas por franja horaria ("Hora a tal Hora") y registra avances físicos.</p>
        </div>
      </div>

      <div className="trainer-grid-two">
        <div className="role-content-box">
          <h3><FaClipboardList /> Registrar Progreso & Medidas</h3>
          {msg && <div className="role-alert-success">{msg}</div>}

          <form onSubmit={handleSaveMeasurement} className="role-mini-form">
            <label>Cliente Asignado *</label>
            <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} required>
              <option value="">— Seleccionar Cliente —</option>
              {(usuarios || []).map((u) => (
                <option key={u.id} value={u.username}>{u.username} ({u.plan || "Sin plan"})</option>
              ))}
            </select>

            <div className="form-two-cols">
              <div>
                <label>Pecho (cm)</label>
                <input type="number" step="0.1" value={measurements.pecho} onChange={(e) => setMeasurements({ ...measurements, pecho: e.target.value })} placeholder="100" />
              </div>
              <div>
                <label>Cintura (cm)</label>
                <input type="number" step="0.1" value={measurements.cintura} onChange={(e) => setMeasurements({ ...measurements, cintura: e.target.value })} placeholder="80" />
              </div>
            </div>

            <div className="form-two-cols">
              <div>
                <label>Brazo (cm)</label>
                <input type="number" step="0.1" value={measurements.brazo} onChange={(e) => setMeasurements({ ...measurements, brazo: e.target.value })} placeholder="36" />
              </div>
              <div>
                <label>Pierna (cm)</label>
                <input type="number" step="0.1" value={measurements.pierna} onChange={(e) => setMeasurements({ ...measurements, pierna: e.target.value })} placeholder="55" />
              </div>
            </div>

            <button type="submit" className="role-save-btn">Guardar Medidas Físicas</button>
          </form>
        </div>

        <div className="role-content-box">
          <h3>Historial de Mediciones Recientes</h3>
          <ul className="history-list">
            {history.map((h, i) => (
              <li key={i} className="history-item">
                <div>
                  <strong>{h.usuario}</strong>
                  <small>📅 {h.fecha}</small>
                </div>
                <div className="measure-pills">
                  <span>Pecho: {h.pecho}</span>
                  <span>Cintura: {h.cintura}</span>
                  <span>Brazo: {h.brazo}</span>
                  <span>Pierna: {h.pierna}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function NutricionistaDashboard({ selectedLanguage, usuarios = [] }) {
  const locale = selectedLanguage?.code || "es";
  const t = getTranslation(locale, "roleDashboards");
  const [selectedClient, setSelectedClient] = useState("");
  const [nutritionForm, setNutritionForm] = useState({ peso: "", grasa: "", musculo: "", objetivo: "Ganancia Muscular", plan: "" });
  const [plans, setPlans] = useState([
    { fecha: "2026-08-22", usuario: "Cliente Demo", peso: "74 kg", grasa: "16%", objetivo: "Pérdida de Grasa", plan: "2100 kcal / 160g Proteína / 200g Carbos" }
  ]);
  const [msg, setMsg] = useState("");

  const handleSaveNutrition = (e) => {
    e.preventDefault();
    if (!selectedClient) {
      alert("Selecciona un cliente.");
      return;
    }
    const newPlan = {
      fecha: new Date().toISOString().split("T")[0],
      usuario: selectedClient,
      peso: `${nutritionForm.peso} kg`,
      grasa: `${nutritionForm.grasa}%`,
      objetivo: nutritionForm.objetivo,
      plan: nutritionForm.plan || "Plan personalizado de nutrición",
    };
    setPlans([newPlan, ...plans]);
    setMsg("✅ Plan nutricional guardado correctamente.");
    setNutritionForm({ peso: "", grasa: "", musculo: "", objetivo: "Ganancia Muscular", plan: "" });
    setTimeout(() => setMsg(""), 3500);
  };

  return (
    <div className="role-db-container">
      <div className="role-db-header nutricionista">
        <div>
          <h2><FaAppleAlt /> {t.nutritionistTitle || "Consola de Nutricionista"}</h2>
          <p>Creación de planes nutricionales, cálculo de requerimientos calóricos y seguimiento de la evolución del cliente.</p>
        </div>
      </div>

      <div className="trainer-grid-two">
        <div className="role-content-box">
          <h3>Elaborar Plan Nutricional</h3>
          {msg && <div className="role-alert-success">{msg}</div>}

          <form onSubmit={handleSaveNutrition} className="role-mini-form">
            <label>Cliente Asignado *</label>
            <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} required>
              <option value="">— Seleccionar Cliente —</option>
              {(usuarios || []).map((u) => (
                <option key={u.id} value={u.username}>{u.username}</option>
              ))}
            </select>

            <div className="form-two-cols">
              <div>
                <label>Peso (kg)</label>
                <input type="number" step="0.1" value={nutritionForm.peso} onChange={(e) => setNutritionForm({ ...nutritionForm, peso: e.target.value })} placeholder="70" required />
              </div>
              <div>
                <label>% Grasa Corporal</label>
                <input type="number" step="0.1" value={nutritionForm.grasa} onChange={(e) => setNutritionForm({ ...nutritionForm, grasa: e.target.value })} placeholder="18" />
              </div>
            </div>

            <label>Objetivo Nutricional</label>
            <select value={nutritionForm.objetivo} onChange={(e) => setNutritionForm({ ...nutritionForm, objetivo: e.target.value })}>
              <option value="Pérdida de Grasa">Pérdida de Grasa / Deficit</option>
              <option value="Ganancia Muscular">Ganancia Muscular / Superávit</option>
              <option value="Mantenimiento Físico">Mantenimiento Físico</option>
              <option value="Rendimiento Deportivo">Rendimiento Deportivo</option>
            </select>

            <label>Detalles del Plan de Alimentación (Macros & Comidas)</label>
            <textarea
              rows="3"
              value={nutritionForm.plan}
              onChange={(e) => setNutritionForm({ ...nutritionForm, plan: e.target.value })}
              placeholder="Ej: Desayuno 3 huevos, Avena 80g. Almuerzo Pechuga 200g, Arroz 150g..."
            ></textarea>

            <button type="submit" className="role-save-btn">Guardar Plan Nutricional</button>
          </form>
        </div>

        <div className="role-content-box">
          <h3>Planes Nutricionales Asignados</h3>
          <ul className="history-list">
            {plans.map((p, i) => (
              <li key={i} className="history-item">
                <div>
                  <strong>{p.usuario}</strong>
                  <span className="role-badge-plan">{p.objetivo}</span>
                </div>
                <small>📅 {p.fecha} | Peso: {p.peso} | Grasa: {p.grasa}</small>
                <p className="plan-desc-text">{p.plan}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ContadorDashboard({ selectedLanguage }) {
  const locale = selectedLanguage?.code || "es";
  const t = getTranslation(locale, "roleDashboards");
  const [transacciones, setTransacciones] = useState([
    { id: 1, tipo: "ingreso", categoria: "Membresía Anual", monto: 480.0, descripcion: "Pago de Membresía Juan Pérez", fecha: "2026-08-25" },
    { id: 2, tipo: "ingreso", categoria: "Personal Trainer", monto: 120.0, descripcion: "Paquete 10 sesiones PT", fecha: "2026-08-24" },
    { id: 3, tipo: "egreso", categoria: "Mantenimiento Equipos", monto: 150.0, descripcion: "Mantenimiento poleas y caminadoras", fecha: "2026-08-23" },
  ]);
  const [monto, setMonto] = useState("");
  const [tipo, setTipo] = useState("ingreso");
  const [categoria, setCategoria] = useState("Membresía");
  const [descripcion, setDescripcion] = useState("");

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!monto) return;
    const newTx = {
      id: Date.now(),
      tipo,
      categoria,
      monto: parseFloat(monto),
      descripcion,
      fecha: new Date().toISOString().split("T")[0],
    };
    setTransacciones([newTx, ...transacciones]);
    setMonto("");
    setDescripcion("");
  };

  const totalIngresos = transacciones.filter((t) => t.tipo === "ingreso").reduce((acc, t) => acc + t.monto, 0);
  const totalEgresos = transacciones.filter((t) => t.tipo === "egreso").reduce((acc, t) => acc + t.monto, 0);
  const balanceNeto = totalIngresos - totalEgresos;

  return (
    <div className="role-db-container">
      <div className="role-db-header contador">
        <div>
          <h2><FaCalculator /> {t.accountantTitle || "Consola de Contador / Finanzas"}</h2>
          <p>Control financiero: Ingresos, egresos, facturación, reportes de contabilidad y balances de cuentas.</p>
        </div>
      </div>

      <div className="role-metrics-three">
        <div className="role-metric-card ingreso">
          <FaDollarSign className="metric-ico" />
          <div>
            <h4>Total Ingresos</h4>
            <h3>${totalIngresos.toFixed(2)}</h3>
          </div>
        </div>
        <div className="role-metric-card egreso">
          <FaFileInvoiceDollar className="metric-ico" />
          <div>
            <h4>Total Egresos</h4>
            <h3>${totalEgresos.toFixed(2)}</h3>
          </div>
        </div>
        <div className="role-metric-card balance">
          <FaChartLine className="metric-ico" />
          <div>
            <h4>Balance Neto</h4>
            <h3>${balanceNeto.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      <div className="trainer-grid-two">
        <div className="role-content-box">
          <h3>Registrar Transacción de Caja</h3>
          <form onSubmit={handleAddTransaction} className="role-mini-form">
            <div className="form-two-cols">
              <div>
                <label>Tipo *</label>
                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  <option value="ingreso">🟢 Ingreso (+)</option>
                  <option value="egreso">🔴 Egreso (-)</option>
                </select>
              </div>
              <div>
                <label>Monto ($) *</label>
                <input type="number" step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="50.00" required />
              </div>
            </div>

            <label>Categoría</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="Membresía">Membresía</option>
              <option value="Personal Trainer">Personal Trainer</option>
              <option value="Mantenimiento">Mantenimiento de Máquinas</option>
              <option value="Servicios Básicos">Servicios Básicos (Luz, Agua)</option>
              <option value="Suplementos">Venta de Suplementos</option>
            </select>

            <label>Descripción / Observación</label>
            <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej: Cobro de plan trimestral en efectivo" />

            <button type="submit" className="role-save-btn">Guardar Asiento Contable</button>
          </form>
        </div>

        <div className="role-content-box">
          <h3>Libro Diario de Transacciones</h3>
          <table className="role-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {transacciones.map((t) => (
                <tr key={t.id}>
                  <td>{t.fecha}</td>
                  <td><strong>{t.categoria}</strong></td>
                  <td>{t.descripcion || "—"}</td>
                  <td className={t.tipo === "ingreso" ? "txt-green" : "txt-red"}>
                    {t.tipo === "ingreso" ? "+" : "-"}${t.monto.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function GerenteDashboard({ selectedLanguage, usuarios = [], sucursales = [] }) {
  const locale = selectedLanguage?.code || "es";
  const t = getTranslation(locale, "roleDashboards");
  return (
    <div className="role-db-container">
      <div className="role-db-header gerente">
        <div>
          <h2><FaChartLine /> {t.managerTitle || "Consola Ejecutiva de Gerencia"}</h2>
          <p>Visualización estratégica del negocio: Ventas, retención de membresías, ocupación por sucursal y rendimiento general.</p>
        </div>
      </div>

      <div className="role-metrics-three">
        <div className="role-metric-card">
          <FaUsers className="metric-ico" />
          <div>
            <h4>Tasa de Retención</h4>
            <h3>94.2%</h3>
          </div>
        </div>
        <div className="role-metric-card">
          <FaBuilding className="metric-ico" />
          <div>
            <h4>Red de Sucursales</h4>
            <h3>{(sucursales || []).length} Ubicaciones</h3>
          </div>
        </div>
        <div className="role-metric-card">
          <FaHeartbeat className="metric-ico" />
          <div>
            <h4>Asistencia Mensual</h4>
            <h3>1,420 Check-Ins</h3>
          </div>
        </div>
      </div>

      <div className="role-content-box">
        <h3>Reporte Estratégico de Rendimiento</h3>
        <p className="gerente-summary">
          El crecimiento del gimnasio muestra un incremento constante del **14% trimestral**. Las sucursales principales mantienen un nivel de ocupación óptimo en franjas horarias de 07:00–09:00 y 18:00–20:00.
        </p>
      </div>
    </div>
  );
}
