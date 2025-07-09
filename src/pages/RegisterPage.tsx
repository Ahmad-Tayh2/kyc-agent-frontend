import AuthLayout from "@/components/auth/AuthLayout";
import { useState } from "react";
import BusinessTypeStep from "@/components/auth/forms/register/BusinessTypeStep";
import RegisterForm from "@/components/auth/forms/register/RegisterForm";

const RegisterPage = () => {
  const [step, setStep] = useState<"type" | "sales" | "partner">("type");

  const handleTypeNext = (type: "sales" | "partner") => {
    if (type === "sales") {
      setStep("sales");
    } else {
      setStep("partner");
    }
  };

  const handleBack = () => {
    setStep("type");
  };

  return (
    <AuthLayout>
      {step === "type" ? (
        <BusinessTypeStep onNext={handleTypeNext} />
      ) : (
        <RegisterForm onBack={handleBack} step={step} />
      )}
    </AuthLayout>
  );
};

export default RegisterPage;
