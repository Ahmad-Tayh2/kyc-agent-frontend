import React from "react";
// import { useForm } from "react-hook-form";
import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useLogin } from "@/hooks/data/useAuth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { validate } from "@/lib/validate";
import ErrorField from "@/components/shared/ErrorField";

interface LoginErrorsTypes {
  email?: string[];
  password?: string[];
}

const createLoginSchema = (t: (key: string) => string) => {
  return z.object({
    email: z.string().email(t("modules.login.fields.email.validationError")),
    password: z
      .string()
      .min(8, t("modules.login.fields.password.minLengthError")),
    remember: z.boolean().optional(),
  });
};

const LoginForm: React.FC<{
  onSuccess: (identifier: string) => void;
  onForgotPassword: () => void;
}> = ({ onSuccess, onForgotPassword }) => {
  const [t] = useTranslation("global");
  const loginSchema = React.useMemo(() => createLoginSchema(t), [t]);

  const [data, setData] = React.useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = React.useState<LoginErrorsTypes | null>(null);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  const { mutateAsync: loginAsync, status } = useLogin();
  const navigate = useNavigate();

  const handleChange =
    (field: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setData((prev) => ({ ...prev, [field]: value }));
      if (hasSubmitted) {
        const { errors: loginErrors } = validate(loginSchema, data);
        setErrors(loginErrors);
      }
    };
    
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    // Validate on submit
    const { errors: loginErrors } = validate(loginSchema, data);
    setErrors(loginErrors);
    if (loginErrors) {
      return;
    }
    // Proceed with login if no validation errors

    try {
      const response = await loginAsync({
        email: data.email,
        password: data.password,
        remember: data.remember,
      });
      if (response.data && response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        navigate(ROUTES.DASHBOARD);
      } else {
        onSuccess(data.email);
      }
    } catch (err: any) {
      // Access error response data if available
      const errorResponse = err.response?.data;
      toast.error(errorResponse?.message);
      setErrors(errorResponse?.errors);

      // if (err instanceof z.ZodError) {
      //   // map errors to your UI
      //   const errors = err.flatten().fieldErrors;
      //   console.log(" errors *********** ---- ",errors);
      // }
      // Error is handled by React Query's error state
    }
  };
  return (
    <form onSubmit={onSubmit} className="space-y-6 my-60">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{t("modules.login.title")}</h1>
        <p className="text-muted-foreground mb-6">
          {t("modules.login.subtitle")}
        </p>
      </div>
      {/* Email Input */}
      <div className="flex flex-col gap-1">
        <Label className="text-[14px]">
          {t("modules.login.fields.email.label")}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="text"
          autoComplete="email"
          className="w-full"
          placeholder={t("modules.login.fields.email.placeholder")}
          value={data.email}
          onChange={handleChange("email")}
        />
        <ErrorField errors={errors?.email} />
      </div>
      {/* Password Input */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="password" className="text-[14px]">
          {t("modules.login.fields.password.label")}
          <span className="text-red-500">*</span>
        </Label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          className="w-full"
          placeholder={t("modules.login.fields.password.placeholder")}
          value={data.password}
          onChange={handleChange("password")}
        />
        <ErrorField errors={errors?.password} />
      </div>

      <div className="flex items-center justify-between ">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-primary text-sm hover:underline ml-auto"
        >
          {t("modules.login.forgotPassword")}
        </button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        className="w-fit px-8 py-5 border-b-2 border-t-2 border-t-[#31dada] border-b-[#149393]"
        disabled={status === "pending"}
      >
        {status === "pending"
          ? t("common.messages.loggingIn")
          : t("common.buttons.login")}
      </Button>
      <p className="text-muted-foreground mb-2">
        {t("modules.login.dontHaveAccount")}
      </p>
      <p className="text-muted-foreground">
        {t("modules.login.becomePartner")}{" "}
        <a
          href={ROUTES.AUTH.REGISTER}
          className="text-primary hover:underline font-medium"
        >
          {t("modules.login.registerLink")}
        </a>
      </p>
    </form>
  );
};

export default LoginForm;
