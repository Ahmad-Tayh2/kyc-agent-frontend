import { useMutation } from "@tanstack/react-query";
import * as authService from "@/services/auth";

export function useLogin() {
  return useMutation({
    mutationFn: authService.login,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: any) => authService.register(payload),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: authService.verifyOtp,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: authService.logout,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authService.forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, email, password, confirmPassword }: { 
      token: string; 
      email: string;
      password: string; 
      confirmPassword: string; 
    }) => authService.resetPassword(token, email, password, confirmPassword),
  });
}

// export const useUpdateUser = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ userId, data }: { userId: string; data: any }) =>
//       updateUser(userId, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["user"] });
//     },
//   });
// };
