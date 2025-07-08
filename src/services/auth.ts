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

export interface OtpPayload {
  code: string;
  email?: string;
  phone?: string;
}

export async function login(payload: LoginPayload) {
  console.log(" test 3");
  console.log(" url to fetch = ", API_URLS.auth.login);
  const res = await fetch(API_URLS.auth.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function register(payload: RegisterPayload) {
  const res = await fetch(API_URLS.auth.register, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export async function verifyOtp(payload: OtpPayload) {
  const res = await fetch(API_URLS.otp.verify, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("OTP verification failed");
  return res.json();
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

      if (!res.ok) throw new Error("Logout failed");

      const response = await res.json();
      if (response.status === true) {
        localStorage.removeItem("token");
        return { success: true };
      } else {
        throw new Error("Logout failed: Invalid response status");
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
      throw error;
    }
  }

  return { success: true };
}
