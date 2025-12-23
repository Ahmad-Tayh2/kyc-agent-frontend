export const ROUTES = {
  DASHBOARD: "/dashboard",
  SEND_REMITTANCE: {
    CREATE: (query?: string) => `/send-remittance${query ?? ""}`,
    EDIT: (transferId: string | number) => `/send-remittance/${transferId}`,
  },
  CUSTOMERS: {
    LIST: "/customers",
    CREATE: "/customers/create",
    CREATE_FORM: "/customers/create/form",
    DETAILS: (customerId: string | number) => `/customers/${customerId}`,
  },
  RECIPIENTS: {
    LIST: "/recipients",
    CREATE: "/recipients/create",
    CREATE_FORM: "/recipients/create/form",
    DETAILS: (recipientId: string | number) => `/recipients/${recipientId}`,
  },
  PAYOUT_LOCATIONS: "/payout-locations",
  TRANSFERS: {
    LIST: "/transfers",
    DETAILS: (transferId: string | number) => `/transfers/${transferId}`,
  },
  COMMISSION_EARNED: "/commission-earned",
  MONEY_WITHDRAWALS: {
    LIST: "/money-withdrawals",
    REQUEST: "/money-withdrawals/request",
  },
  ADD_MONEY: "/add-money",
  ACCOUNT_STATEMENTS: "/account-statements",
  MY_WALLET: "/my-wallet",
  REMITTANCE_CART: "/remittance-cart",
  CUSTOMER_FORMS: "/customer-forms",
  PAYMENT_LINKS: {
    LIST: "/payment-links",
    VALIDATION: (token: string) => `/payment/${token}`,
  },
  PAYMENT: {
    UNIFIED: (token: string) => `/payment/${token}`, // New unified route
    SUCCESS: "/payment/success",
    FAILED: "/payment/failed",
    CANCELLED: "/payment/cancelled",
  },
  SUPPORT: {
    LIST: "/support",
    ISSUE: (id: string[number]) => `/support/issue/${id}`,
  },
  HELP: "/help",
  PROFILE: "/profile",
  SETTINGS: {
    TAB: (tabId: string) => `/settings/${tabId}`,
    DEFAULT: "/settings",
  },
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
  },
};
