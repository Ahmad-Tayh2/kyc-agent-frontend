const baseUrl = "https://nomadrem.amazing-agileteam.com/api";

export const API_URLS = {
  auth: {
    login: `${baseUrl}/auth/login`,
    logout: `${baseUrl}/auth/logout`,
    register: `${baseUrl}/auth/register/agent`,
    forgotPassword: `${baseUrl}/auth/forgot-password`,
    resetPassword: `${baseUrl}/auth/reset-password`,
    resendVerification: `${baseUrl}/auth/agents/send-verification-email`,
    refresh: `${baseUrl}/auth/refresh`,
    user: `${baseUrl}/auth/user`,
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

    // Customer Recipients endpoints
    getRecipients: (customerId: string | number) =>
      `${baseUrl}/customers/${customerId}/recipients`,
    attachRecipient: (
      customerId: string | number,
      recipientId: string | number
    ) => `${baseUrl}/customers/${customerId}/recipients/${recipientId}`,
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
    create: `${baseUrl}/transactions`,
    update: (id: string | number) => `${baseUrl}/transactions/${id}`,
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
    previewAnyExchange: () =>
      `${baseUrl}/exchange-money-transactions/preview-any`,
  },
  countryAllowedCurrencies: {
    get: (filters: string) => `${baseUrl}/country-allowed-currencies${filters}`,
    getByCountry: (countryId: string | number, filters: string) =>
      `${baseUrl}/countries/${countryId}/currencies${filters}`,
    getByCurrency: (currencyId: string | number, filters: string) =>
      `${baseUrl}/currencies/${currencyId}/countries${filters}`,
  },
  remittancePurposes: {
    get: (filters: string) => `${baseUrl}/remittance-purposes${filters}`,
    getById: (id: string | number) => `${baseUrl}/remittance-purposes/${id}`,
  },
  sourceIncomes: {
    get: (filters: string) => `${baseUrl}/source-incomes${filters}`,
    getById: (id: string | number) => `${baseUrl}/source-incomes/${id}`,
  },
};
