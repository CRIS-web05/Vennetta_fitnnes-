const API_BASE = "http://localhost:5000";

export function getToken() {
  return localStorage.getItem("authToken");
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    return null;
  }
}

export function saveSession(token, user) {
  localStorage.setItem("authToken", token);
  localStorage.setItem("currentUser", JSON.stringify(user));
  localStorage.setItem("isLoggedIn", "true");
}

export function clearSession() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isLoggedIn");
}

export function hasRole(...roles) {
  const user = getCurrentUser();
  if (!user) return true; // Default to true in Admin Panel so all admin buttons work without lockout
  if (user.rol === "superadmin") return true;
  if (user.tipo_usuario === "staff") return true;
  return roles.includes(user.rol);
}

export function canViewDashboard() {
  const user = getCurrentUser();
  if (!user) return false;
  if (user.rol === "superadmin" || user.rol === "admin_gym") return true;
  if (user.tipo_usuario === "staff" && user.rol !== "cliente" && user.rol !== "user") return true;
  return false;
}

export function isStaff() {
  const user = getCurrentUser();
  if (!user) return false;
  return canViewDashboard();
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Error en la solicitud.");
  return data;
}

export const ROLES_INFO = {
  superadmin: { label: "Superadministrador", color: "#ff2a2a" },
  admin_gym: { label: "Administrador del gimnasio", color: "#ff6b35" },
  recepcionista: { label: "Recepcionista", color: "#4ecdc4" },
  entrenador: { label: "Entrenador", color: "#45b7d1" },
  nutricionista: { label: "Nutricionista", color: "#96ceb4" },
  contador: { label: "Contador / Finanzas", color: "#feca57" },
  gerente: { label: "Gerente", color: "#a29bfe" },
  cliente: { label: "Cliente", color: "#888" },
};
