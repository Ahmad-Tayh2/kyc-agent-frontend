const baseUrl = "https://amazing-agileteam.com/api";

export const API_URLS = {
  auth: {
    login: `${baseUrl}/auth/login`,
    logout: `${baseUrl}/auth/logout`,
    register: `${baseUrl}/auth/register/agent`,
  },
  otp: {
    verify: `${baseUrl}/auth/otp/verify`,
  },
};
