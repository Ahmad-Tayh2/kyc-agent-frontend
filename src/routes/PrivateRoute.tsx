import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../constants/routes";

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.AUTH.LOGIN} replace />;
};

export default PrivateRoute;
