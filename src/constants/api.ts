const baseUrl = "https://amazing-agileteam.com/api";

export const API_URLS = {
  auth: {
    login: `${baseUrl}/auth/login`,
    logout: `${baseUrl}/auth/logout`,
    register: `${baseUrl}/auth/register/agent`,
    forgotPassword: `${baseUrl}/auth/forgot-password`,
    resetPassword: `${baseUrl}/auth/reset-password`,
  },
  otp: {
    verify: `${baseUrl}/auth/otp/verify`,
  },
  address: {
    countries: `${baseUrl}/countries`,
    citiesByCountry: (countryId: string | number) =>
      `${baseUrl}/countries/${countryId}/cities`,
  },
  agents: {
    get: (agentId: string | number) => `${baseUrl}/agent/${agentId}`,
    update: (agentId: string | number) => `${baseUrl}/agent/${agentId}`,

    uploadDocuments: (agentId: string | number) =>
      `${baseUrl}/agents/${agentId}/upload-documents`,
  },
  customers: {
    get: (filters: string) => `${baseUrl}/customers${filters}`,
  },
};
