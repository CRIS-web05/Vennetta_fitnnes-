import { Navigate } from "react-router-dom";
import { getCurrentUser, canViewDashboard } from "../utils/auth";

function RoleGuard({ children, roles, redirectTo = "/" }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If specific roles are passed (e.g. ["superadmin"]), check exact role match
  if (roles && roles.length > 0) {
    const hasSpecificRole = roles.includes(user.rol);
    if (!hasSpecificRole) {
      return <Navigate to={redirectTo} replace />;
    }
  } else {
    // Default guard for admin/dashboard pages
    if (!canViewDashboard()) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
}

export default RoleGuard;
