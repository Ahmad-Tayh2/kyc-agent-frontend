import AuthLayout from "@/components/auth/AuthLayout";
import { useState } from "react";
import BusinessTypeStep from "@/components/auth/forms/register/BusinessTypeStep";
import RegisterForm from "@/components/auth/forms/register/RegisterForm";

const RegisterPage = () => {
  const [step, setStep] = useState<"type" | "sales" | "partner">("type");
  const [partnerRoles, setPartnerRoles] = useState<string[]>([]);

  const handleTypeNext = (type: "sales" | "partner", roles?: string[]) => {
    if (type === "sales") {
      setStep("sales");
    } else {
      setPartnerRoles(roles || []);
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
        <RegisterForm
          onBack={handleBack}
          step={step}
          // partnerRoles={partnerRoles}
        />
      )}
    </AuthLayout>
  );
};

export default RegisterPage;
