import React from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/forms/reset-password/ResetPasswordForm";
import { ROUTES } from "@/constants/routes";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Redirect to login if no token or email
  if (!token || !email) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  return (
    <AuthLayout>
      <ResetPasswordForm 
        token={token} 
        email={email}
        onBack={() => window.location.href = ROUTES.AUTH.LOGIN} 
      />
    </AuthLayout>
  );
};

export default ResetPasswordPage; 