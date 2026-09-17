const jwt = require("jsonwebtoken");
const { hasPermission } = require("../roles");

const JWT_SECRET = process.env.JWT_SECRET || "vendetta-fitness-jwt-secret-2026";

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token de autenticación requerido." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: "Token inválido o expirado." });
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado." });
    }
    if (req.user.rol === "superadmin" || allowedRoles.includes(req.user.rol)) {
      return next();
    }
    return res.status(403).json({ message: "No tienes permisos para esta acción." });
  };
}

function requirePermission(permiso) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado." });
    }
    if (hasPermission(req.user.rol, permiso)) {
      return next();
    }
    return res.status(403).json({ message: "Permiso insuficiente." });
  };
}

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      rol: user.rol,
      rol_nombre: user.rol_nombre,
      sucursal_id: user.sucursal_id,
      sucursal_nombre: user.sucursal_nombre,
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}

module.exports = { authenticateToken, authorize, requirePermission, signToken, JWT_SECRET };
