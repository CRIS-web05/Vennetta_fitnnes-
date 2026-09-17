const ROLES = [
  {
    slug: "superadmin",
    nombre: "Superadministrador",
    descripcion: "Control total del sistema. Gestiona usuarios, permisos, configuraciones y módulos.",
    permisos: ["*"],
  },
  {
    slug: "admin_gym",
    nombre: "Administrador del gimnasio",
    descripcion: "Gestiona operación general, clientes, empleados, membresías, pagos y reportes.",
    permisos: [
      "usuarios.read", "usuarios.write",
      "sucursales.read", "sucursales.write",
      "rutinas.read", "rutinas.write",
      "emprendedores.read", "emprendedores.write",
      "membresias.read", "membresias.write",
      "pagos.read", "pagos.write",
      "reportes.read", "dashboard.read",
    ],
  },
  {
    slug: "recepcionista",
    nombre: "Recepcionista",
    descripcion: "Registra clientes, gestiona membresías, check-in/out y pagos básicos.",
    permisos: [
      "usuarios.read", "usuarios.write",
      "membresias.read", "membresias.write",
      "checkin.read", "checkin.write",
      "pagos.read", "pagos.write",
      "sucursales.read",
    ],
  },
  {
    slug: "entrenador",
    nombre: "Entrenador / Personal Trainer",
    descripcion: "Consulta clientes asignados, crea rutinas y registra progreso.",
    permisos: [
      "usuarios.read",
      "rutinas.read", "rutinas.write",
      "clientes_asignados.read",
      "sesiones.read", "sesiones.write",
    ],
  },
  {
    slug: "nutricionista",
    nombre: "Nutricionista",
    descripcion: "Crea planes nutricionales y registra evaluaciones de clientes.",
    permisos: [
      "usuarios.read",
      "nutricion.read", "nutricion.write",
      "clientes_asignados.read",
    ],
  },
  {
    slug: "contador",
    nombre: "Contador / Finanzas",
    descripcion: "Gestiona pagos, facturas, cobros y reportes financieros.",
    permisos: [
      "pagos.read", "pagos.write",
      "facturas.read", "facturas.write",
      "reportes.read", "finanzas.read",
    ],
  },
  {
    slug: "gerente",
    nombre: "Gerente",
    descripcion: "Acceso estratégico a dashboards, ventas, asistencia y rendimiento.",
    permisos: [
      "dashboard.read", "reportes.read",
      "usuarios.read", "sucursales.read",
      "rutinas.read", "pagos.read", "membresias.read",
    ],
  },
  {
    slug: "cliente",
    nombre: "Cliente",
    descripcion: "Miembro del gimnasio con acceso al portal.",
    permisos: ["profile.read", "rutinas.read"],
  },
];

const STAFF_ROLES = ROLES.filter((r) => r.slug !== "cliente").map((r) => r.slug);

function hasPermission(rolSlug, permiso) {
  const rol = ROLES.find((r) => r.slug === rolSlug);
  if (!rol) return false;
  if (rol.permisos.includes("*")) return true;
  if (rol.permisos.includes(permiso)) return true;
  const [modulo] = permiso.split(".");
  return rol.permisos.includes(`${modulo}.*`);
}

function canAccessRoute(rolSlug, routeKey) {
  const routePermissions = {
    superadmin: ["superadmin"],
    admin: ["admin_gym", "recepcionista", "superadmin"],
    sucursales: ["superadmin", "admin_gym"],
    rutinas: ["superadmin", "admin_gym", "entrenador", "gerente"],
    emprendedores: ["superadmin", "admin_gym", "gerente"],
    staff: ["superadmin"],
    finanzas: ["superadmin", "admin_gym", "contador", "gerente"],
    dashboard: STAFF_ROLES,
  };
  const allowed = routePermissions[routeKey] || [];
  return allowed.includes(rolSlug);
}

module.exports = { ROLES, STAFF_ROLES, hasPermission, canAccessRoute };
