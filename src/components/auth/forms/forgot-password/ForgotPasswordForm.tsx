import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForgotPassword } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

interface ForgotPasswordFormProps {
  onBack: () => void;
  onSuccess: (email: string) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onBack,
  onSuccess,
}) => {
  const [email, setEmail] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const {
    mutateAsync: forgotPasswordAsync,
    status,
    error,
  } = useForgotPassword();

  const [t] = useTranslation("global");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!email) {
      newErrors.email = t("modules.forgotPassword.fields.email.required");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t("modules.forgotPassword.fields.email.error");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await forgotPasswordAsync(email);
      onSuccess(email);
    } catch (err) {
      // Error is handled by React Query's error state
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 my-70">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{t("modules.forgotPassword.title")}</h1>
        <p className="text-muted-foreground mb-6">
          {t("modules.forgotPassword.subtitle")}
        </p>
      </div>

      {/* Email Input */}
      <div className="flex flex-col gap-1">
        <Label className="text-[14px]">
          {t("modules.forgotPassword.fields.email.label")}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full"
          placeholder={t("modules.forgotPassword.fields.email.placeholder")}
          value={email}
          onChange={handleEmailChange}
        />
        {errors.email && (
          <span className="text-destructive text-xs">{errors.email}</span>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-destructive text-sm">
          {(error as Error).message}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        className="w-fit px-8 py-5 border-b-2 border-t-2 border-t-[#31dada] border-b-[#149393]"
        disabled={status === "pending"}
      >
        {status === "pending" ? t("common.messages.sending") : t("common.buttons.sendResetLink")}
      </Button>

      <p className="text-muted-foreground">
        {t("modules.forgotPassword.rememberPassword")}{" "}
        <button
          type="button"
          onClick={onBack}
          className="text-primary hover:underline font-medium"
        >
          {t("modules.forgotPassword.backToLogin")}
        </button>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;
