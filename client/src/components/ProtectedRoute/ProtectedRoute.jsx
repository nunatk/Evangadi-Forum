import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../Loader/Loader";

export default function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);

  // Still checking token
  if (loading) return <Loader />;

  // If no user, redirect once
  if (!user) return <Navigate to="/auth/login" replace />;

  // User valid allow route
  return <Outlet />;
}
