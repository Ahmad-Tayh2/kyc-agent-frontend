import { useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useCheckAuth } from "@/hooks/data/useAuth";
import Loader from "@/components/shared/Loader";

const PrivateRoute = () => {
  const token = localStorage.getItem("token") ?? "";
  const { data, isLoading } = useCheckAuth(token);
  const isAuthorized = useMemo(() => {
    if (isLoading) return false;
    if (data?.status !== undefined) return data?.status;
    return false;
  }, [isLoading, data]);

  if (isLoading) {
    return <Loader className="h-screen w-screen" />;
  }
  return isAuthorized ? (
    <Outlet />
  ) : (
    <Navigate to={ROUTES.AUTH.LOGIN} replace />
  );
};

export default PrivateRoute;
