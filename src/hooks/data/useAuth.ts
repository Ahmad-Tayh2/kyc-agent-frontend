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
        // Step 1: Register the user
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

        // Step 2: Upload files if provided
        let uploadResult = null;
        if (files && files.length > 0) {
          try {
            const formData = new FormData();
            files.forEach((file) => {
              formData.append("files", file);
            });

            const uploadResponse = await authService.uploadFiles(agentId, formData);
            if (uploadResponse.ok) {
              uploadResult = await uploadResponse.json();
            } else {
              // Upload failed but registration succeeded
              console.warn("File upload failed:", uploadResponse.status);
              uploadResult = {
                status: "error",
                message: `Upload failed with status ${uploadResponse.status}`,
              };
            }
          } catch (uploadError) {
            console.warn("File upload error:", uploadError);
            uploadResult = {
              status: "error",
              message: "File upload failed due to network or server error",
            };
          }
        }

        return {
          registration: registerData,
          upload: uploadResult,
          success: true,
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

export function useResendVerification() {
  return useMutation({
    mutationFn: authService.resendVerification,
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
