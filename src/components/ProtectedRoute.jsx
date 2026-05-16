import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E4002B]" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user.status === "expired" || user.blocked) {
    return <Navigate to="/subscription-expired" replace />;
  }
  return children;
}
