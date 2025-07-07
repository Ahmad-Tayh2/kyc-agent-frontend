import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm: React.FC<{ onSuccess: (identifier: string) => void }> = ({
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    // resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = (data: LoginFormInputs) => {
    // Simulate login API, then call onSuccess with email
    onSuccess(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 my-70">
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
          {...register("email")}
        />
        {errors.email && (
          <span className="text-destructive text-xs">
            {errors.email.message}
          </span>
        )}
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
          {...register("password")}
        />
        {errors.password && (
          <span className="text-destructive text-xs">
            {errors.password.message}
          </span>
        )}
      </div>
      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox {...register("remember")} />
          Remember me
        </Label>
        <a href="#" className="text-primary text-sm hover:underline">
          Forgot password
        </a>
      </div>
      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        className="w-fit px-8 py-5 border-b-2 border-t-2 border-t-[#31dada] border-b-[#149393]"
      >
        LOGIN
      </Button>
      {/* Register Links */}
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
