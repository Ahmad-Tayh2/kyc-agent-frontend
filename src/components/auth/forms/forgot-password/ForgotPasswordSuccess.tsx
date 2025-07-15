import React from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ForgotPasswordSuccessProps {
  onBack: () => void;
  email: string;
}

const ForgotPasswordSuccess: React.FC<ForgotPasswordSuccessProps> = ({
  onBack,
  email,
}) => {
  const [t] = useTranslation("global");

  return (
    <div className="space-y-6 my-45 text-center">
      {/* Header Section */}
      <div>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">
          {t("modules.forgotPasswordSuccess.title")}
        </h1>
        <p className="text-muted-foreground mb-6">
          {t("modules.forgotPasswordSuccess.subtitle")} <strong>{email}</strong>
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-left">
        <h3 className="font-semibold text-primary mb-2">
          {t("modules.forgotPasswordSuccess.nextSteps.title")}
        </h3>
        <ul className="text-primary space-y-2 text-sm">
          {(
            t("modules.forgotPasswordSuccess.nextSteps.steps", {
              returnObjects: true,
            }) as string[]
          ).map((step: string, index: number) => (
            <li key={index}>• {step}</li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <Button
          type="button"
          variant="default"
          className="w-fit px-8 py-5 border-b-2 border-t-2 border-t-[#31dada] border-b-[#149393]"
          onClick={onBack}
        >
          {t("common.buttons.backToLogin")}
        </Button>

        <p className="text-muted-foreground">
          {t("modules.forgotPasswordSuccess.didntReceiveEmail")}{" "}
          <button
            type="button"
            onClick={onBack}
            className="text-primary hover:underline font-medium"
          >
            {t("modules.forgotPasswordSuccess.tryAgain")}
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordSuccess;
