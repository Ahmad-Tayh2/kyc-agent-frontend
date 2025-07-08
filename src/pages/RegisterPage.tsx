import AuthLayout from "@/components/auth/AuthLayout";
import React, { useState } from "react";
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

  const handleSalesSubmit = (data: any) => {
    // Handle sales person registration submit
    console.log("Sales Person Registration:", data);
  };

  const handlePartnerSubmit = (data: any) => {
    // Handle partner registration submit
    console.log("Partner Registration:", data, "Roles:", partnerRoles);
  };

  return (
    <AuthLayout>
      {step === "type" ? (
        <BusinessTypeStep onNext={handleTypeNext} />
      ) : (
        <RegisterForm
          onBack={handleBack}
          onSubmit={handleSalesSubmit}
          step={step}
        />
      )}
    </AuthLayout>
  );
};

export default RegisterPage;
