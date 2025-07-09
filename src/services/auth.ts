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

export async function register(
  payload: RegisterPayload,
  type: "business" | "sales",
  partnerRoles?: string[]
) {
  console.log(" payload = ", payload);
  console.log(" type = ", type);
  console.log(" partnerRoles = ", partnerRoles);
  // const businessPayload = {
  //   ...payload,
  //   partnerRoles: partnerRoles || [],
  // };
  // Sales person registration - send as FormData for file upload
  const formData = new FormData();

  // Add all text fields
  Object.keys(payload).forEach((key) => {
    if (key !== "identity") {
      formData.append(key, payload[key]);
    }
  });

  // Add files
  if (payload.identity && payload.identity.length > 0) {
    for (let i = 0; i < payload.identity.length; i++) {
      formData.append("identity", payload.identity[i]);
    }
  }
  // console.log(" partnerRoles = ", partnerRoles);

  console.log(" just before send = =  =", formData);
  const res = await fetch(API_URLS.auth.register, {
    method: "POST",
    body: formData, // Don't set Content-Type header for FormData
  });

  const response = await res.json();

  if (!res.ok) {
    const errorMessage = response.message || "Registration failed";
    throw new Error(errorMessage);
  }

  return response;
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
