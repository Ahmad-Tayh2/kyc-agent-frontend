import React from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useLogin } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

// const loginSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   remember: z.boolean().optional(),
// });

// type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm: React.FC<{ onSuccess: (identifier: string) => void }> = ({
  onSuccess,
}) => {
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
      const response = await loginAsync({ email: data.email, password: data.password, remember: data.remember });
      console.log("response", response);
      // Check if response has data with access_token
      if (response.data && response.data.access_token) {
        // Store token and redirect to dashboard
        localStorage.setItem('token', response.data.access_token);
        navigate(ROUTES.DASHBOARD);
      } else {
        // Empty response, go to OTP step
        onSuccess(data.email);
      }
    } catch (err) {
      // Error is handled by React Query's error state
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 my-70">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Log in to your account</h1>
        <p className="text-muted-foreground mb-6">
          Welcome back! Please enter your details.
        </p>
      </div>
      {/* Email Input */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full"
          placeholder="Enter your email"
          value={data.email}
          onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
        />
        {/* {errors.email && (
          <span className="text-destructive text-xs">
            {errors.email.message}
          </span>
        )} */}
      </div>
      {/* Password Input */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          className="w-full"
          placeholder="••••••••"
          value={data.password}
          onChange={(e) => setData(prev => ({ ...prev, password: e.target.value }))}
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
            onCheckedChange={(checked) => setData(prev => ({ ...prev, remember: !!checked }))}
          />
          Remember me
        </Label>
        <a href="#" className="text-primary text-sm hover:underline">
          Forgot password
        </a>
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
        {status === "pending" ? "Logging in..." : "LOGIN"}
      </Button>
      <p className="text-muted-foreground mb-2">Don't have an account?</p>
      <p className="text-muted-foreground">
        Become our business partner and{" "}
        <a
          href={ROUTES.AUTH.REGISTER}
          className="text-primary hover:underline font-medium"
        >
          Register
        </a>
      </p>
    </form>
  );
};

export default LoginForm;
