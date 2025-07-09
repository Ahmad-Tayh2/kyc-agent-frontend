import { useMutation } from "@tanstack/react-query";
import * as authService from "@/services/auth";

export function useLogin() {
  return useMutation({
    mutationFn: authService.login,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: ({
      payload,
      type,
      partnerRoles,
    }: {
      payload: any;
      type: "business" | "sales";
      partnerRoles?: string[];
    }) => authService.register(payload, type, partnerRoles),
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
