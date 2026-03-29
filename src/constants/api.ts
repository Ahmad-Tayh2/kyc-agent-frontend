export const baseUrl = "https://nomadrem.amazing-agileteam.com/api/v1";
export const serverUrl = "https://nomadrem.amazing-agileteam.com";
//export const baseUrl = 'http://localhost:8000/api';

export const API_URLS = {
  auth: {
    login: `${baseUrl}/auth/login`,
    logout: `${baseUrl}/auth/logout`,
    register: `${baseUrl}/auth/register/agent`,
    forgotPassword: `${baseUrl}/auth/forgot-password`,
    resetPassword: `${baseUrl}/auth/reset-password`,
    changePassword: `${baseUrl}/auth/change-password`,
    resendVerification: `${baseUrl}/auth/agents/send-verification-email`,
    refresh: `${baseUrl}/auth/refresh`,
    user: `${baseUrl}/auth/user`,
    verifyEmail: `${baseUrl}/auth/verify-email`,
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
    uploadAuthDocuments: (agentId: string | number) =>
      `${baseUrl}/auth/agents/${agentId}/id-documents`,
    uploadDocuments: (agentId: string | number) =>
      `${baseUrl}/agents/${agentId}/id-documents`,
    attachCustomer: (agentId: string | number, customerId: string | number) =>
      `${baseUrl}/agents/${agentId}/customers/${customerId}`,
    attachRecipient: (agentId: string | number, recipientId: string | number) =>
      `${baseUrl}/agents/${agentId}/recipients/${recipientId}`,
    detachRecipient: (agentId: string | number, recipientId: string | number) =>
      `${baseUrl}/agents/${agentId}/recipients/${recipientId}`,
    getAgentRecipients: (agentId: string | number) =>
      `${baseUrl}/agents/${agentId}/recipients`,
    getExtraFees: (agentId: string | number) =>
      `${baseUrl}/agents/${agentId}/extra-fees`,
  },
  customers: {
    get: (filters: string) => `${baseUrl}/customers${filters}`,
    getActive: (filters: string) => `${baseUrl}/customers/active${filters}`,
    search: `${baseUrl}/customers/search`,
    create: `${baseUrl}/customers`,
    getById: (id: string | number) => `${baseUrl}/customers/${id}`,
    update: (id: string | number) => `${baseUrl}/customers/${id}`,

    identityDocuments: (id: string | number) =>
      `${baseUrl}/customers/${id}/identity-documents`,
    incomeDocuments: (id: string | number) =>
      `${baseUrl}/customers/${id}/income-documents`,

    // Customer Recipients endpoints
    getRecipients: (customerId: string | number) =>
      `${baseUrl}/customers/${customerId}/recipients`,
    attachRecipient: (
      customerId: string | number,
      recipientId: string | number,
    ) => `${baseUrl}/customers/${customerId}/recipients/${recipientId}`,
  },
  paymentLinks: {
    get: (filters: string) => `${baseUrl}/payment-links${filters}`,
    create: `${baseUrl}/payment-links`,
    regenerate: (id: number) =>
      `${baseUrl}/payment-links/${id}/regenerate-token`,
    validate: (token: string) => `${baseUrl}/payment-links/token/${token}`,
    getByTransaction: (transactionId: string) =>
      `${baseUrl}/payment-links/transaction/${transactionId}`,
    getByCart: (cartId: string) =>
      `${baseUrl}/payment-links/remittance-cart/${cartId}`,
    expire: (paymentLinkId: string | number) =>
      `${baseUrl}/payment-links/${paymentLinkId}/expire`,
    markSuccessful: (paymentLinkId: string | number) =>
      `${baseUrl}/payment-links/${paymentLinkId}/mark-successful`,
    regenerateToken: (paymentLinkId: string | number) =>
      `${baseUrl}/payment-links/${paymentLinkId}/regenerate-token`,
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
    getByRef: (ref: string) => `${baseUrl}/transactions/${ref}`,
    getById: (id: number | string) => `${baseUrl}/transactions/get/${id}`,
    create: `${baseUrl}/transactions`,
    update: (ref: string) => `${baseUrl}/transactions/${ref}`,
    preview: `${baseUrl}/transactions/preview`,
    previewByRef: (ref: string) => `${baseUrl}/transactions/preview/${ref}`,
  },
  remittanceCart: {
    get: (filters: string) => `${baseUrl}/remittance-carts${filters}`,
    create: `${baseUrl}/remittance-carts`,
    update: (cartId: string | number) =>
      `${baseUrl}/remittance-carts/${cartId}`,
    getById: (cartId: string | number) =>
      `${baseUrl}/remittance-carts/${cartId}`,
    delete: (cartId: string | number) =>
      `${baseUrl}/remittance-carts/${cartId}`,
    addTransaction: `${baseUrl}/remittance-carts/add-transaction`,
    removeTransaction: (transactionId: string | number) =>
      `${baseUrl}/remittance-carts/transactions/${transactionId}/remove`,
  },
  financialReport: {
    getCommissionEarned: (filters: string) =>
      `${baseUrl}/financial-reports/agent-commissions${filters}`,
    getAccountStatements: (filters: string) =>
      `${baseUrl}/financial-reports/agent-account-statements${filters}`,
  },
  bankAccounts: {
    get: (filters: string) => `${baseUrl}/bank-accounts${filters}`,
    create: `${baseUrl}/bank-accounts`,
  },
  remittanceMethods: {
    get: () => `${baseUrl}/remittance-methods`,
    verifyAccountInfo: () =>
      `${baseUrl}/remittance-methods/verify-account-info`,
  },
  recipientRemittanceMethods: {
    get: () => `${baseUrl}/recipient-remittance-methods`,
    create: () => `${baseUrl}/recipient-remittance-methods`,
    getById: (id: string | number) =>
      `${baseUrl}/recipient-remittance-methods/${id}`,
    update: (id: string | number) =>
      `${baseUrl}/recipient-remittance-methods/${id}`,
    delete: (id: string | number) =>
      `${baseUrl}/recipient-remittance-methods/${id}`,
  },
  payoutLocations: {
    get: () => `${baseUrl}/payout-agents`,
  },
  recipientPayouts: {
    get: () => `${baseUrl}/recipient-payout-agents`,
    create: () => `${baseUrl}/recipient-payout-agents`,
    getById: (id: string | number) =>
      `${baseUrl}/recipient-payout-agents/${id}`,
    update: (id: string | number) => `${baseUrl}/recipient-payout-agents/${id}`,
    delete: (id: string | number) => `${baseUrl}/recipient-payout-agents/${id}`,
  },
  customerForms: {
    get: (filters?: string) => `${baseUrl}/customer-forms${filters}`,
    getById: (id: string | number) => `${baseUrl}/customer-forms/${id}`,
    create: () => `${baseUrl}/customer-forms`,
    validateToken: (token: string) =>
      `${baseUrl}/customer-forms/validate-token/${token}`,
    submit: (token: string) => `${baseUrl}/customer-forms/${token}/submit`,
    regenerateToken: (id: string | number) =>
      `${baseUrl}/customer-forms/${id}/regenerate-token`,
  },
  wallet: {
    get: (agentId: string | number) => `${baseUrl}/agents/${agentId}/wallet`,
    deleteCurrency: () => "", // URL not ready yet
    addCurrency: (walletId: string | number) =>
      `${baseUrl}/wallets/${walletId}/currencies`,
    getAddMoneyTransactions: (filters: string) =>
      `${baseUrl}/add-money-transactions${filters}`,
    payTransaction: `${baseUrl}/wallet/pay-transaction`,
    canPayTransaction: (transactionReference: string) =>
      `${baseUrl}/wallet/can-pay/${transactionReference}`,
  },

  transactions: {
    get: () => `${baseUrl}/wallet-transactions`,
  },
  currencies: {
    get: () => `${baseUrl}/currencies`,
    exchange: () => `${baseUrl}/exchange-money-transactions`,
    preview: () => `${baseUrl}/exchange-money-transactions/preview`,
    previewAnyExchange: () =>
      `${baseUrl}/exchange-money-transactions/preview-any`,
  },
  remittancePurposes: {
    get: (filters: string) => `${baseUrl}/remittance-purposes${filters}`,
    getById: (id: string | number) => `${baseUrl}/remittance-purposes/${id}`,
  },
  sourceIncomes: {
    get: (filters: string) => `${baseUrl}/source-incomes${filters}`,
    getById: (id: string | number) => `${baseUrl}/source-incomes/${id}`,
  },
  payments: {
    create: `${baseUrl}/payments`,
    validate: `${baseUrl}/payments/validate`,
  },
  apisAndGateways: {
    getList: `${baseUrl}/apis/list`,
  },
  remittanceAvailability: {
    receiveCountries: `${baseUrl}/remittance-availability/receive-countries`,
    sendCountries: `${baseUrl}/remittance-availability/send-countries`,
    methods: (receiveCountryId?: number) => {
      const url = `${baseUrl}/remittance-availability/methods`;
      return receiveCountryId
        ? `${url}?receive_country=${receiveCountryId}`
        : url;
    },
    recipientMethods: (recipientId: number, receiveCountryId: number) =>
      `${baseUrl}/remittance-availability/recipients/${recipientId}/methods?receive_country=${receiveCountryId}`,
    sendCountryCurrencies: (countryId: number) =>
      `${baseUrl}/remittance-availability/send-countries/${countryId}/currencies`,
    receiveCountryCurrencies: (countryId: number) =>
      `${baseUrl}/remittance-availability/receive-countries/${countryId}/currencies`,
  },
};
