import React from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useLogin } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// const loginSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   remember: z.boolean().optional(),
// });

// type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm: React.FC<{
  onSuccess: (identifier: string) => void;
  onForgotPassword: () => void;
}> = ({ onSuccess, onForgotPassword }) => {
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<LoginFormInputs>({
  //   resolver: zodResolver(loginSchema),
  //   defaultValues: { email: "", password: "", remember: false },
  // });

  const [data, setData] = React.useState({
    email: "",
    password: "",
    remember: false,
  });

  const { mutateAsync: loginAsync, status, error } = useLogin();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (err) {
      // Error is handled by React Query's error state
    }
  };
  const [t] = useTranslation("global");
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
          type="email"
          autoComplete="email"
          className="w-full"
          placeholder={t("modules.login.fields.email.placeholder")}
          value={data.email}
          onChange={(e) =>
            setData((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        {/* {errors.email && (
          <span className="text-destructive text-xs">
            {errors.email.message}
          </span>
        )} */}
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
          onChange={(e) =>
            setData((prev) => ({ ...prev, password: e.target.value }))
          }
        />
        {/* {errors.password && (
          <span className="text-destructive text-xs">
            {errors.password.message}
          </span>
        )} */}
      </div>
      
      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox
            checked={data.remember}
            onCheckedChange={(checked) =>
              setData((prev) => ({ ...prev, remember: !!checked }))
            }
          />
          {t("modules.login.rememberMe")}
        </Label>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-primary text-sm hover:underline"
        >
          {t("modules.login.forgotPassword")}
        </button>
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
        {status === "pending" ? t("common.messages.loggingIn") : t("common.buttons.login")}
      </Button>
      <p className="text-muted-foreground mb-2">{t("modules.login.dontHaveAccount")}</p>
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
