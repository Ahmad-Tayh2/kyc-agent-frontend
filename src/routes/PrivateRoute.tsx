import { useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useCheckAuth } from "@/hooks/data/useAuth";
import Loader from "@/components/shared/Loader";

const PrivateRoute = () => {
  const { data, isLoading } = useCheckAuth();
  const isAuthorized = useMemo(() => {
    if (isLoading) return false;
    return data.status;
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
