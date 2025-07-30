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
