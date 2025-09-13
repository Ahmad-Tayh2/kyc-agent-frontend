import { API_URLS } from "@/constants/api";
import apiClient from "@/lib/axiosInstance";

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterPayload {
  // Define all registration fields as needed
  [key: string]: any;
}

export interface BusinessPartnerPayload {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  address: string;
  city: string;
  country: string;
  state?: string;
  phone: string;
  gender: string;
  businessName: string;
  businessAddress: string;
  businessCity: string;
  businessCountry: string;
  partnerRoles: string[];
}

export interface SalesPersonPayload {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  address: string;
  city: string;
  country: string;
  state?: string;
  phone: string;
  gender: string;
  identity: FileList;
}

export interface OtpPayload {
  code: string;
  email?: string;
  phone?: string;
}

// export async function login(payload: LoginPayload) {
//   const res = await fetch(API_URLS.auth.login, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   const response = await res.json();

//   if (!res.ok) {
//     const errorMessage = response.message || "Login failed";
//     throw new Error(errorMessage);
//   }

//   return response;
// }

export async function login(payload: LoginPayload) {
  const response = await apiClient.post(API_URLS.auth.login, payload);
  return response.data;
}

export async function register(payload: RegisterPayload) {
  try {
    // Check if we have files to upload
    let response = await fetch(API_URLS.auth.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Registration request timed out. Please try again.");
      }
      throw error;
    }

    throw new Error("An unexpected error occurred during registration");
  }
}

export async function uploadFiles(agentId: string, formData: FormData) {
  return fetch(API_URLS.agents.uploadDocuments(agentId), {
    method: "POST",
    body: formData,
  });
}

export async function verifyOtp(payload: OtpPayload) {
  const res = await fetch(API_URLS.otp.verify, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const response = await res.json();

  if (!res.ok) {
    const errorMessage = response.message || "OTP verification failed";
    throw new Error(errorMessage);
  }

  return response;
}

export async function logout() {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const res = await fetch(API_URLS.auth.logout, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const response = await res.json();

      if (!res.ok) {
        const errorMessage = response.message || "Logout failed";
        throw new Error(errorMessage);
      }

      if (response.status === true) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        localStorage.removeItem("user");

        return { success: true };
      } else {
        const errorMessage =
          response.message || "Logout failed: Invalid response status";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
      throw error;
    }
  }

  return { success: true };
}

export async function forgotPassword(email: string) {
  try {
    const res = await fetch(API_URLS.auth.forgotPassword, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const response = await res.json();

    if (!res.ok) {
      const errorMessage = response.message || "Failed to send reset email";
      throw new Error(errorMessage);
    }

    return response;
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
}

export async function resetPassword(
  token: string,
  email: string,
  password: string,
  confirmPassword: string
) {
  try {
    const res = await fetch(API_URLS.auth.resetPassword, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      }),
    });

    const response = await res.json();

    if (!res.ok) {
      const errorMessage = response.message || "Failed to reset password";
      throw new Error(errorMessage);
    }

    return response;
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
}

export async function resendVerification(email: string) {
  try {
    const res = await fetch(API_URLS.auth.resendVerification, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const response = await res.json();

    if (!res.ok) {
      const errorMessage =
        response.message || "Failed to resend verification email";
      throw new Error(errorMessage);
    }

    return response;
  } catch (error) {
    console.error("Resend verification error:", error);
    throw error;
  }
}

export async function refreshToken() {
  try {
    const res = await fetch(API_URLS.auth.refresh, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const response = await res.json();

    if (!res.ok) {
      const errorMessage =
        response.message || "Failed to resend verification email";
      throw new Error(errorMessage);
    }

    return response;
  } catch (error) {
    console.error("Resend verification error:", error);
    throw error;
  }
}

// export const getAuthUser = async (): Promise<ApiResponse<LoginResponse>> => {
//   return authenticatedApiRequest<LoginResponse>({
//     method: "GET",
//     url: API_ENDPOINTS,
//   });
// };

export const getAuthUser = async () => {
  const res = await fetch(API_URLS.auth.user, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const response = await res.json();
  // const response = await apiClient.get(API_URLS.auth.user);
  return response;
};
