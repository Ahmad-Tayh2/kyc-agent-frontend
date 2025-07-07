import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../constants/routes";

const PublicRoute = () => {
  const token = localStorage.getItem("token");

  // If the user is authenticated, redirect them to the dashboard
  return token ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Outlet />;
};

export default PublicRoute;
