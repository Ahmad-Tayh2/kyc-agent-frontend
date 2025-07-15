import { useMutation } from "@tanstack/react-query";
import * as authService from "@/services/auth";

export function useLogin() {
  return useMutation({
    mutationFn: authService.login,
  });
}

export function useRegisterAndUpload() {
  return useMutation({
    mutationFn: async ({ payload, files }: { payload: any; files: File[] }) => {
      console.log("Data to send =", { payload, files });

      try {
        const registerResponse = await authService.register(payload);
        const registerData = await registerResponse.json();

        if (!registerResponse.ok) {
          throw new Error(
            `Registration failed: ${registerData?.errors || "Unknown error"}`
          );
        }

        const agentId = registerData?.data?.agent?.id;
        if (!agentId) {
          throw new Error("Agent ID not found in registration response");
        }

        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file);
        });

        const uploadResponse = await authService.uploadFiles(agentId, formData);
        if (!uploadResponse.ok) {
          throw new Error(
            `File upload failed with status ${uploadResponse.status}`
          );
        }

        const uploadResult = await uploadResponse.json();

        return {
          registration: registerData,
          upload: uploadResult,
        };
      } catch (error) {
        // Log and re-throw so react-query can handle the error properly
        console.error("Error in registration/upload mutation:", error);
        throw error;
      }
    },
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
    mutationFn: ({
      token,
      email,
      password,
      confirmPassword,
    }: {
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
