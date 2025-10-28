export const CUSTOMER_STATUSES = [
  "active",
  "banned",
  "kyc_income",
  "kyc_identity",
];

export const CUSTOMER_STATUS_COLORS = {
  active: "#027A48", // Green
  banned: "#B42318", // Red
  kyc_income: "#9D7C5F", // Amber
  kyc_identity: "#DF6B1D", // Blue
} as const;

export const PAYMENT_LINKS_STATUSES = [
  "valid_link",
  "expired_link",
  "successful_payment",
];
export const PAYMENT_LINKS_STATUSES_COLORS = {
  successful_payment: "#027A48", // Green
  expired_link: "#B42318", // Red
  valid_link: "#DF6B1D", // Blue
} as const;

export const TRASACTIONS_STATUSES = [
  "initiated",
  "in-progress",
  "completed",
  "cancelled",
  "blocked",
  "refunded",
];
export const TRASACTIONS_STATUSES_COLORS = {
  initiated: "#000000",
  "in-progress": "#000000",
  completed: "#000000",
  cancelled: "#000000",
  blocked: "#000000",
  refunded: "#000000",
} as const;
export const TRASACTIONS_TYPES = [
  "transfer",
  "add_money",
  "withdraw_money",
  "exchange_money",
];
