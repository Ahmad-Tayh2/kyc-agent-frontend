import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as authService from "@/services/auth";
import { ROUTES } from "@/constants/routes";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useLogin() {
  return useMutation({
    mutationFn: authService.login,
  });
}

export function useRegisterAndUpload() {
  return useMutation({
    mutationFn: async ({ payload, files }: { payload: any; files: File[] }) => {
      console.log("Data to send =", { payload, files });
      // registration
      // :
      try {
        // Step 1: Register the user
        const registerResponse = await authService.register(payload);
        const registerData = await registerResponse.json();

        // if (!registerResponse.ok) {
        //   throw new Error(
        //     `Registration failed: ${registerData?.errors || "Unknown error"}`
        //   );
        // }

        const agentId = registerData?.data?.agent?.id;
        if (!agentId) {
          return {
            registration: registerData,
            // upload: uploadResult,
            success: false,
          };
          // throw new Error("Agent ID not found in registration response");
        }

        // Step 2: Upload files if provided
        let uploadResult = null;
        if (files && files.length > 0) {
          try {
            const formData = new FormData();
            files.forEach((file) => {
              formData.append("files[]", file);
            });

            const uploadResponse = await authService.uploadAuthFiles(
              agentId,
              formData
            );
            uploadResult = await uploadResponse.json();
            // if (uploadResponse.ok) {
            // } else {
            //   // Upload failed but registration succeeded
            //   console.warn("File upload failed:", uploadResponse.status);
            //   uploadResult = {
            //     status: "error",
            //     message: `Upload failed with status ${uploadResponse.status}`,
            //   };
            // }
          } catch (uploadError) {
            console.warn("File upload error:", uploadError);
            uploadResult = {
              status: false,
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      navigate(ROUTES.AUTH.LOGIN);
      queryClient.clear();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: authService.forgotPassword,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: any) => authService.changePassword(data),
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
    onSuccess: () =>
      toast.success(
        "Verification email sent. Check your inbox to activate your account."
      ),
  });
}

export function useVerifyEmail({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  return useQuery({
    queryFn: () => authService.verifyEmail(email, token),
    queryKey: ["auth-verify-agent-email", token, email],
    enabled: !!token && !!email,
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

export function useRefreshToken() {
  return useMutation({
    mutationFn: async () => {
      const response = await authService.refreshToken();
      // Update token and user data
      if (response?.data.access_token) {
        localStorage.setItem("token", response?.data.access_token);
        localStorage.setItem("user", JSON.stringify(response?.data.user));

        // Store new token expiration time
        const expirationTime = Date.now() + response?.data.expires_in * 1000;
        localStorage.setItem("tokenExpiration", expirationTime.toString());
      }

      return response?.data;
    },
  });
}

export function useCheckAuth(token?: string) {
  return useQuery({
    queryKey: ["auth-user", token], // include token so changes invalidate and refetch appropriately
    queryFn: () => authService.getAuthUser(token),
    staleTime: 0, // data is considered stale immediately
    // cacheTime: 0, // do not keep data in cache
    refetchOnWindowFocus: false,
    retry: false,
  });
}
