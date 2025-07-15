import AuthLayout from "@/components/auth/AuthLayout";
import { useState } from "react";
import BusinessTypeStep from "@/components/auth/forms/register/BusinessTypeStep";
import RegisterForm from "@/components/auth/forms/register/RegisterForm";

const RegisterPage = () => {
  const [step, setStep] = useState<"type" | "sales" | "partner">("type");
  const [isSendingPartner, setIsSendingPartner] = useState(false);
  const [isPayoutPartner, setIsPayoutPartner] = useState(false);
  const handleTypeNext = (
    type: "sales" | "partner",
    partnerRoles?: string[]
  ) => {
    if (type === "sales") {
      setStep("sales");
    } else {
      setIsSendingPartner(partnerRoles?.includes("sending") || false);
      setIsPayoutPartner(partnerRoles?.includes("payout") || false);
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
          isSendingPartner={isSendingPartner}
          isPayoutPartner={isPayoutPartner}
        />
      )}
    </AuthLayout>
  );
};

export default RegisterPage;
