const baseUrl = "https://amazing-agileteam.com/api";

export const API_URLS = {
  auth: {
    login: `${baseUrl}/auth/login`,
    logout: `${baseUrl}/auth/logout`,
    register: `${baseUrl}/auth/register/agent`,
    forgotPassword: `${baseUrl}/auth/forgot-password`,
    resetPassword: `${baseUrl}/auth/reset-password`,
    resendVerification: `${baseUrl}/auth/agents/send-verification-email`,
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
    get: (agentId: string | number) => `${baseUrl}/agents/${agentId}`,
    update: (agentId: string | number) => `${baseUrl}/agents/${agentId}`,

    uploadDocuments: (agentId: string | number) =>
      `${baseUrl}/agents/${agentId}/upload-documents`,
  },
  customers: {
    get: (filters: string) => `${baseUrl}/customers${filters}`,
    search: `${baseUrl}/customers/search`,
    create: `${baseUrl}/customers`,
    getById: (id: string | number) => `${baseUrl}/customers/${id}`,
    update: (id: string | number) => `${baseUrl}/customers/${id}`,

    uploadIdentityDocuments: (id: string | number) =>
      `${baseUrl}/customers/${id}/upload-identity-documents`,
    uploadIncomeDocuments: (id: string | number) =>
      `${baseUrl}/customers/${id}/upload-income-documents`,
  },
  recipients: {
    get: (filters: string) => `${baseUrl}/recipients${filters}`,
    search: (query: string) => `${baseUrl}/recipients/search?${query}`,
    create: `${baseUrl}/recipients`,
    getById: (id: string | number) => `${baseUrl}/recipients/${id}`,
    update: (id: string | number) => `${baseUrl}/recipients/${id}`,
  },

  transfers: {
    get: (filters: string) => `${baseUrl}/transactions${filters}`,
    getById: (id: string | number) => `${baseUrl}/transactions/${id}`,
  },

  bankAccounts: {
    create: `${baseUrl}/bank-accounts`,
  },
  remittanceMethods: {
    get: () => `${baseUrl}/remittance-methods`,
  },
  payoutLocations: {
    get: () => `${baseUrl}/payout-agents`,
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
    deleteCurrency: () => "", // URL not ready yet
    addCurrency: (walletId: string | number) =>
      `${baseUrl}/wallets/${walletId}/currencies`,
  },
  transactions: {
    get: () => `${baseUrl}/extra-transactions`,
  },
  currencies: {
    get: () => `${baseUrl}/currencies`,
    exchange: () => `${baseUrl}/exchange-money-transactions`,
    preview: () => `${baseUrl}/exchange-money-transactions/preview`,
  },
};
