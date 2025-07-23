const baseUrl = 'https://amazing-agileteam.com/api';

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
    states: (countryId: string | number) =>
      `${baseUrl}/countries/${countryId}/states`,
  },
  agents: {
    get: (agentId: string | number) => `${baseUrl}/agent/${agentId}`,
    update: (agentId: string | number) => `${baseUrl}/agent/${agentId}`,

    uploadDocuments: (agentId: string | number) =>
      `${baseUrl}/agents/${agentId}/upload-documents`,
  },
  customers: {
    get: (filters: string) => `${baseUrl}/customers${filters}`,
    search: `${baseUrl}/customers/search`,
    create: `${baseUrl}/customers`,
    getById: (id: string | number) => `${baseUrl}/customers/${id}`,
    update: (id: string | number) => `${baseUrl}/customers/${id}`,
  },
  remittanceMethods: {
    get: () => `${baseUrl}/remittance-methods`,
  },
  payoutLocations: {
    get: () => `${baseUrl}/external_payout_agents`,
  },
  customerForms: {
    get: () => `${baseUrl}/customer-forms`,
    getById: (id: string | number) => `${baseUrl}/customer-forms/${id}`,
    create: () => `${baseUrl}/customer-forms`,
    validateToken: (token: string) =>
      `${baseUrl}/customer-forms/validate-token/${token}`,
    submit: (token: string) => `${baseUrl}/customer-forms/${token}/submit`,
  },
  wallet: {
    get: (agentId: string | number) => `${baseUrl}/agents/${agentId}/wallet`,
    deleteCurrency: () => '', // URL not ready yet
  },
  transactions: {
    get: () => `${baseUrl}/extra-transactions`,
  },
  currencies: {
    get: () => `${baseUrl}/currencies`,
    exchange: () => `${baseUrl}/exchange-money-transactions`,
  },
};
