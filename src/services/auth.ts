import { API_URLS } from "@/constants/api";

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

export async function login(payload: LoginPayload) {
  const res = await fetch(API_URLS.auth.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const response = await res.json();

  if (!res.ok) {
    const errorMessage = response.message || "Login failed";
    throw new Error(errorMessage);
  }

  return response;
}

export async function register(payload: RegisterPayload) {
  try {
    // Check if we have files to upload
    const hasFiles = payload?.identity_attachment?.length > 0;

    let res: Response;

    if (hasFiles) {
      // Use FormData for file uploads
      const formData = new FormData();

      // Add all text fields
      Object.keys(payload).forEach((key) => {
        if (key !== "identity_attachment") {
          // Handle nested objects like address
          if (typeof payload[key] === "object" && payload[key] !== null) {
            Object.keys(payload[key]).forEach((nestedKey) => {
              formData.append(`${key}[${nestedKey}]`, payload[key][nestedKey]);
            });
          } else {
            formData.append(key, payload[key]);
          }
        }
      });

      // Add files
      for (let i = 0; i < payload.identity_attachment.length; i++) {
        formData.append(
          "identity_attachment[]",
          payload.identity_attachment[i]
        );
      }

      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      res = await fetch(API_URLS.auth.register, {
        method: "POST",
        body: formData,
        credentials: "include",
        redirect: "follow",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    } else {
      // Use JSON for text-only data
      console.log("JSON payload:", payload);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      res = await fetch(API_URLS.auth.register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
        redirect: "follow",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
    }

    // Check if response is a redirect
    if (res.redirected) {
      console.warn("Response was redirected to:", res.url);
      // If it's a redirect, it might be a success redirect to login page
      return { success: true, message: "Registration successful" };
    }

    // Check if response is JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Response is not JSON:", contentType);
      const text = await res.text();
      console.log("Response text:", text);

      // If it's HTML (likely a redirect page), treat as success
      if (text.includes("<html") || text.includes("<!DOCTYPE")) {
        return { success: true, message: "Registration successful" };
      }

      throw new Error("Unexpected response format");
    }

    const response = await res.json();

    if (!res.ok) {
      const errorMessage = response.message || "Registration failed";
      throw new Error(errorMessage);
    }

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
