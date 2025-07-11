import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/forms/login/LoginForm";
import TwoFactorForm from "@/components/auth/forms/login/TwoFactorForm";
import ForgotPasswordForm from "@/components/auth/forms/forgot-password/ForgotPasswordForm";
import ForgotPasswordSuccess from "@/components/auth/forms/forgot-password/ForgotPasswordSuccess";
import { useState } from "react";

const AuthPage = () => {
  const [step, setStep] = useState<
    "login" | "otp" | "forgot-password" | "forgot-password-success"
  >("login");
  const [phoneOrEmail, setPhoneOrEmail] = useState<string>("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>("");

  const handleLoginSuccess = (identifier: string) => {
    setPhoneOrEmail(identifier);
    setStep("otp");
  };

  const handleOtpVerify = (code: string) => {
    // Handle OTP verification and redirect to app
    console.log("OTP verified:", code);
  };

  const handleForgotPassword = () => {
    setStep("forgot-password");
  };

  const handleForgotPasswordSuccess = (email: string) => {
    setForgotPasswordEmail(email);
    setStep("forgot-password-success");
  };

  const handleBackToLogin = () => {
    setStep("login");
  };

  return (
    <AuthLayout>
      {step === "login" && false && (
        <LoginForm
          onSuccess={handleLoginSuccess}
          onForgotPassword={handleForgotPassword}
        />
      )}
      {step === "otp" && (
        <TwoFactorForm onVerify={handleOtpVerify} phoneOrEmail={phoneOrEmail} />
      )}
      {step === "forgot-password" && (
        <ForgotPasswordForm
          onBack={handleBackToLogin}
          onSuccess={handleForgotPasswordSuccess}
        />
      )}
      {step === "forgot-password-success" ||
        (true && (
          <ForgotPasswordSuccess
            onBack={handleBackToLogin}
            email={forgotPasswordEmail}
          />
        ))}
    </AuthLayout>
  );
};

export default AuthPage;
