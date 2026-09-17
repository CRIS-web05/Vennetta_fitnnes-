import React, { useEffect, useState } from "react";
import { FiUsers, FiCreditCard, FiCalendar, FiMail, FiGlobe, FiTrendingUp, FiZap, FiPrinter, FiX } from "react-icons/fi";
import { apiFetch } from "../utils/auth";
import "../styles/dashboard.css";

const STAT_CONFIG = [
  { key: "usuarios", icon: FiUsers, accent: "#ff4b4b", labelKey: "users" },
  { key: "membresias", icon: FiCreditCard, accent: "#ff7a45", labelKey: "memberships" },
  { key: "reservas", icon: FiCalendar, accent: "#ffb347", labelKey: "reservations" },
  { key: "contactos", icon: FiMail, accent: "#ff6b9d", labelKey: "contacts" },
];

const translations = {
  es: {
    badge: "Panel Ejecutivo",
    title: "Dashboard Vendetta",
    description:
      "Monitoriza tu rendimiento, entrenamientos y soporte inteligente desde un solo lugar.",
    users: "Usuarios",
    memberships: "Membresías",
    reservations: "Reservas",
    contacts: "Contactos",
    languagesAvailable: "Idiomas disponibles",
    quickActions: "Acciones rápidas",
    quickActionsDesc: "Accede a las partes del panel que más importan con un solo toque.",
    viewReport: "Ver informe",
    manageMembers: "Gestionar miembros",
    reviewReservations: "Revisar reservas",
    insightTitle1: "Crecimiento de membresías",
    insightText1: "La captación de membresías aumentó un 12% este mes, sigue mejorando las ofertas.",
    insightTitle2: "Respuesta rápida",
    insightText2: "El tiempo de respuesta sigue por debajo de 15 minutos para mayor satisfacción.",
    loading: "Cargando estadísticas...",
    error: "No se pudieron cargar los datos. Verifica que el servidor esté activo.",
    retry: "Reintentar",
    liveData: "Datos en vivo",
    totalRecords: "Registros totales",
  },
  en: {
    badge: "Executive Panel",
    title: "Vendetta Dashboard",
    description:
      "Monitor your performance, training and intelligent support from one place.",
    users: "Users",
    memberships: "Memberships",
    reservations: "Reservations",
    contacts: "Contacts",
    languagesAvailable: "Available Languages",
    quickActions: "Quick Actions",
    quickActionsDesc: "Access the parts of the panel that matter most in a single tap.",
    viewReport: "View report",
    manageMembers: "Manage members",
    reviewReservations: "Review reservations",
    insightTitle1: "Active membership growth",
    insightText1: "Membership uptake is up 12% this month. Keep improving conversion with clear offers.",
    insightTitle2: "Fast support response",
    insightText2: "Contact response time remains under 15 minutes, ensuring user satisfaction.",
    loading: "Loading statistics...",
    error: "Could not load data. Make sure the server is running.",
    retry: "Retry",
    liveData: "Live data",
    totalRecords: "Total records",
  },
  pt: {
    badge: "Painel Executivo",
    title: "Painel Vendetta",
    description:
      "Monitore seu desempenho, treinos e suporte inteligente em um só lugar.",
    users: "Usuários",
    memberships: "Planos",
    reservations: "Reservas",
    contacts: "Contatos",
    languagesAvailable: "Idiomas disponíveis",
    quickActions: "Ações rápidas",
    quickActionsDesc: "Acesse as partes do painel que mais importam com um só toque.",
    viewReport: "Ver relatório",
    manageMembers: "Gerenciar membros",
    reviewReservations: "Revisar reservas",
    insightTitle1: "Crescimento de adesões",
    insightText1: "A adesão aumentou 12% este mês. Continue melhorando as ofertas.",
    insightTitle2: "Resposta rápida",
    insightText2: "O tempo de resposta permanece abaixo de 15 minutos, garantindo satisfação.",
    loading: "Carregando estatísticas...",
    error: "Não foi possível carregar os dados. Verifique se o servidor está ativo.",
    retry: "Tentar novamente",
    liveData: "Dados ao vivo",
    totalRecords: "Registros totais",
  },
};

function Dashboard({ selectedLanguage, languageCount, embedded = false }) {
  const locale = selectedLanguage?.code || "es";
  const t = translations[locale] || translations.es;

  const [stats, setStats] = useState({
    usuarios: 0,
    membresias: 0,
    reservas: 0,
    contactos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState("Informe General de Usuarios y Entrenadores");
  const [reportData, setReportData] = useState({ usuarios: [], staff: [], emprendedores: [] });

  const loadStats = () => {
    setLoading(true);
    setError(false);

    fetch("http://localhost:5000/api/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Dashboard request failed");
        return res.json();
      })
      .then((data) => {
        setStats(data);
      })
      .catch((fetchError) => {
        console.error("Error cargando dashboard:", fetchError);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOpenReport = async (title = "Informe General de Usuarios y Entrenadores") => {
    setReportTitle(title);
    let usuarios = [];
    let staff = [];
    let emprendedores = [];

    try {
      const uRes = await apiFetch("/api/admin/usuarios").catch(() => []);
      if (Array.isArray(uRes) && uRes.length > 0) usuarios = uRes;
      else usuarios = JSON.parse(localStorage.getItem("admin_usuarios") || "[]");
    } catch {
      usuarios = JSON.parse(localStorage.getItem("admin_usuarios") || "[]");
    }

    try {
      const sRes = await apiFetch("/api/staff").catch(() => []);
      if (Array.isArray(sRes) && sRes.length > 0) staff = sRes;
      else staff = JSON.parse(localStorage.getItem("staff_members") || "[]");
    } catch {
      staff = JSON.parse(localStorage.getItem("staff_members") || "[]");
    }

    try {
      const eRes = await apiFetch("/api/emprendedores").catch(() => []);
      if (Array.isArray(eRes) && eRes.length > 0) emprendedores = eRes;
      else emprendedores = JSON.parse(localStorage.getItem("emprendedores_solicitudes") || "[]");
    } catch {
      emprendedores = JSON.parse(localStorage.getItem("emprendedores_solicitudes") || "[]");
    }

    // Default rich fallback data if empty
    if (usuarios.length === 0) {
      usuarios = [
        { id: 1, username: "Superadmin Principal", email: "admin@gym.com", telefono: "0987654321", plan: "Anual", estado: "Activo", fecha: "2026-08-26" },
        { id: 2, username: "Carlos Cliente", email: "carlos@ejemplo.com", telefono: "0991112233", plan: "Trimestre", estado: "Activo", fecha: "2026-08-25" },
        { id: 3, username: "Mateo Silva", email: "mateo.silva@ejemplo.com", telefono: "0991234567", plan: "Mensual", estado: "Activo", fecha: "2026-09-01" },
        { id: 4, username: "Fatme Merizalde", email: "fatme@vendettafitness.com", telefono: "0984445566", plan: "Anual", estado: "Activo", fecha: "2026-07-15" }
      ];
    }

    if (staff.length === 0) {
      staff = [
        { id: 1, username: "Carlos Mendoza (Entrenador)", email: "carlos.entrenador@gym.com", telefono: "0991234567", rol_nombre: "Entrenador / Personal Trainer", horario: "06:00 AM - 14:00 PM", sucursal_nombre: "Vendetta Fitness Matriz" },
        { id: 2, username: "María Fernández (Entrenadora)", email: "maria.entrenador@gym.com", telefono: "0997654321", rol_nombre: "Entrenador / Personal Trainer", horario: "14:00 PM - 22:00 PM", sucursal_nombre: "Vendetta Fitness Matriz" },
        { id: 3, username: "Alex Fitness (Entrenador)", email: "alex.entrenador@gym.com", telefono: "0998887766", rol_nombre: "Entrenador / Personal Trainer", horario: "08:00 AM - 16:00 PM", sucursal_nombre: "Vendetta Fitness Sur" },
        { id: 4, username: "Laura Recepción", email: "laura.recepcion@gym.com", telefono: "0993334455", rol_nombre: "Recepcionista", horario: "06:00 AM - 14:00 PM", sucursal_nombre: "Vendetta Fitness Matriz" }
      ];
    }

    setReportData({ usuarios, staff, emprendedores });
    setReportModalOpen(true);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const totalRecords = stats.usuarios + stats.membresias + stats.reservas + stats.contactos;

  return (
    <section className={`dashboard-section${embedded ? " dashboard-section--embedded" : ""}`}>
      <div className="dashboard-card">
        <header className="dashboard-header">
          <div className="dashboard-header-main">
            <span className="dashboard-badge">
              <FiZap aria-hidden="true" />
              {t.badge}
            </span>
            <h2>{t.title}</h2>
            <p>{t.description}</p>
          </div>

          <div className="dashboard-summary">
            <div className="dashboard-summary-card">
              <div className="dashboard-summary-icon">
                <FiGlobe aria-hidden="true" />
              </div>
              <div>
                <strong>{languageCount}</strong>
                <span>{t.languagesAvailable}</span>
              </div>
            </div>
            <div className="dashboard-summary-card dashboard-summary-card--accent">
              <div className="dashboard-summary-icon">
                <FiTrendingUp aria-hidden="true" />
              </div>
              <div>
                <strong>{loading ? "—" : totalRecords}</strong>
                <span>{t.totalRecords}</span>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="dashboard-error" role="alert">
            <p>{t.error}</p>
            <button type="button" className="assistant-btn" onClick={loadStats}>
              {t.retry}
            </button>
          </div>
        )}

        <div className="dashboard-stats-header">
          <span className="dashboard-live-dot" aria-hidden="true" />
          <span>{t.liveData}</span>
        </div>

        <div className="dashboard-grid">
          {STAT_CONFIG.map(({ key, icon: Icon, accent, labelKey }) => (
            <article
              key={key}
              className="dashboard-tile"
              style={{ "--tile-accent": accent }}
            >
              <div className="dashboard-tile-top">
                <div className="dashboard-tile-icon">
                  <Icon aria-hidden="true" />
                </div>
                <h3>{t[labelKey]}</h3>
              </div>
              {loading ? (
                <div className="dashboard-skeleton" aria-label={t.loading} />
              ) : (
                <p className="dashboard-stat-value">{stats[key]}</p>
              )}
            </article>
          ))}
        </div>

        <div className="assistant-section">
          <div className="assistant-card">
            <div className="assistant-content">
              <h3>{t.quickActions}</h3>
              <p>{t.quickActionsDesc}</p>
            </div>
            <div className="assistant-actions">
              <button className="assistant-btn" type="button" onClick={() => handleOpenReport("Informe Completo de Usuarios, Entrenadores y Reservas")}>
                {t.viewReport}
              </button>
              <button className="assistant-btn secondary" type="button" onClick={() => handleOpenReport("Informe de Gestión de Miembros y Clientes")}>
                {t.manageMembers}
              </button>
              <button className="assistant-btn secondary" type="button" onClick={() => handleOpenReport("Informe de Reservas y Entrenadores")}>
                {t.reviewReservations}
              </button>
            </div>
          </div>

          <div className="assistant-card assistant-insights">
            <div className="insight-tile">
              <h4>{t.insightTitle1}</h4>
              <p>{t.insightText1}</p>
            </div>
            <div className="insight-tile">
              <h4>{t.insightTitle2}</h4>
              <p>{t.insightText2}</p>
            </div>
          </div>
        </div>
      </div>

      {/* REPORT MODAL & PRINTABLE PDF SHEET */}
      {reportModalOpen && (
        <div className="report-modal-overlay" onClick={() => setReportModalOpen(false)}>
          <div className="report-modal-content report-print-container" onClick={(e) => e.stopPropagation()}>
            <div className="report-modal-header report-no-print">
              <div>
                <h2>📄 Informe PDF Vendetta Fitness</h2>
                <p>Generación de informe listo para imprimir o guardar como PDF respetando el diseño del sistema.</p>
              </div>
              <div className="report-modal-actions">
                <button type="button" className="assistant-btn" onClick={() => window.print()}>
                  <FiPrinter /> Imprimir / PDF
                </button>
                <button type="button" className="assistant-btn secondary" onClick={() => setReportModalOpen(false)}>
                  <FiX /> Cerrar
                </button>
              </div>
            </div>

            <div className="printable-report-sheet">
              {/* Header */}
              <div className="report-sheet-header">
                <div className="report-brand">
                  <h1>VENDETTA <span className="red-text">FITNESS</span></h1>
                  <p>INDUSTRY DE LA SALUD Y EL ENTRENAMIENTO ELITE</p>
                </div>
                <div className="report-meta">
                  <div><strong>{reportTitle.toUpperCase()}</strong></div>
                  <div>Fecha de emisión: {new Date().toLocaleDateString("es-EC")} {new Date().toLocaleTimeString("es-EC")}</div>
                  <div>Estado del Sistema: 🟢 Operativo</div>
                </div>
              </div>

              {/* Section 1: Entrenadores & Staff */}
              <div className="report-section">
                <h3 className="report-section-title">🏋️ ENTRENADORES Y PERSONAL DE STAFF</h3>
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Entrenador / Staff</th>
                      <th>Rol / Cargo</th>
                      <th>Correo Electrónico</th>
                      <th>Teléfono de Contacto</th>
                      <th>Horario / Turno</th>
                      <th>Sucursal Asignada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.staff.map((s, idx) => (
                      <tr key={idx}>
                        <td><strong>{s.username}</strong></td>
                        <td>{s.rol_nombre || s.rol || "Entrenador / Personal Trainer"}</td>
                        <td>{s.email}</td>
                        <td className="highlight-cell">📞 {s.telefono || "—"}</td>
                        <td>{s.horario || "06:00 AM - 14:00 PM"}</td>
                        <td>{s.sucursal_nombre || "Vendetta Fitness Matriz"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Section 2: Clientes y Usuarios */}
              <div className="report-section">
                <h3 className="report-section-title">👥 CLIENTES Y USUARIOS REGISTRADOS</h3>
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre del Cliente / Persona</th>
                      <th>Correo Electrónico</th>
                      <th>Teléfono</th>
                      <th>Plan de Membresía</th>
                      <th>Estado</th>
                      <th>Fecha de Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.usuarios.map((u, idx) => (
                      <tr key={idx}>
                        <td>#{u.id || idx + 1}</td>
                        <td><strong>{u.username}</strong></td>
                        <td>{u.email}</td>
                        <td className="highlight-cell">📞 {u.telefono || "—"}</td>
                        <td><span className="report-badge-plan">{u.plan || "Sin plan"}</span></td>
                        <td><span className={`report-status ${u.estado?.toLowerCase() || "activo"}`}>{u.estado || "Activo"}</span></td>
                        <td>{u.fecha || new Date().toISOString().split("T")[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Section 3: Solicitudes & Reservas */}
              {reportData.emprendedores.length > 0 && (
                <div className="report-section">
                  <h3 className="report-section-title">🚀 SOLICITUDES Y RESERVAS DE EMPRENDEDORES</h3>
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Correo Electrónico</th>
                        <th>Teléfono</th>
                        <th>Ciudad</th>
                        <th>Inversión Estimada / Propuesta</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.emprendedores.map((e, idx) => (
                        <tr key={idx}>
                          <td><strong>{e.nombre}</strong></td>
                          <td>{e.email}</td>
                          <td className="highlight-cell">📞 {e.telefono || "—"}</td>
                          <td>{e.ciudad || "—"}</td>
                          <td>{e.inversion_estimada || e.mensaje || "—"}</td>
                          <td><span className="report-badge-plan">{e.estado || "Nuevo"}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="report-footer-note">
                <p>© {new Date().getFullYear()} Vendetta Fitness Industry ®️ - Documento oficial generado para impresión y exportación PDF.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Dashboard;