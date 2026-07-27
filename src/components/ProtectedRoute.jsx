import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, isInitializing, user } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
        Checking your session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
