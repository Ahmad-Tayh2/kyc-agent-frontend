import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useTranslation } from "react-i18next";

interface ResetPasswordFormProps {
  token: string;
  email: string;
  onBack: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  token,
  email,
  onBack,
}) => {
  const [formData, setFormData] = React.useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const { mutateAsync: resetPasswordAsync, status, error } = useResetPassword();
  const navigate = useNavigate();
  const [t] = useTranslation("global");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.password) {
      newErrors.password = t(
        "modules.resetPassword.fields.newPassword.required"
      );
    } else if (formData.password.length < 6) {
      newErrors.password = t(
        "modules.resetPassword.fields.newPassword.minLength"
      );
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t(
        "modules.resetPassword.fields.confirmNewPassword.required"
      );
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t(
        "modules.resetPassword.fields.confirmNewPassword.error"
      );
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await resetPasswordAsync({
        token,
        email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      // Redirect to login page on success
      navigate(ROUTES.AUTH.LOGIN);
    } catch (err) {
      // Error is handled by React Query's error state
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 my-55">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {t("modules.resetPassword.title")}
        </h1>
        <p className="text-muted-foreground mb-6">
          {t("modules.resetPassword.subtitle")} <strong>{email}</strong>
        </p>
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <Label htmlFor="password">
          {t("modules.resetPassword.fields.newPassword.label")}
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          className="w-full"
          placeholder={t(
            "modules.resetPassword.fields.newPassword.placeholder"
          )}
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
        />
        {errors.password && (
          <span className="text-destructive text-xs">{errors.password}</span>
        )}
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">
          {t("modules.resetPassword.fields.confirmNewPassword.label")}
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="w-full"
          placeholder={t(
            "modules.resetPassword.fields.confirmNewPassword.placeholder"
          )}
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
        />
        {errors.confirmPassword && (
          <span className="text-destructive text-xs">
            {errors.confirmPassword}
          </span>
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
        {status === "pending"
          ? t("common.messages.resetting")
          : t("common.buttons.resetPassword")}
      </Button>

      <p className="text-muted-foreground">
        {t("modules.resetPassword.rememberPassword")}{" "}
        <button
          type="button"
          onClick={onBack}
          className="text-primary hover:underline font-medium"
        >
          {t("modules.resetPassword.backToLogin")}
        </button>
      </p>
    </form>
  );
};

export default ResetPasswordForm;
