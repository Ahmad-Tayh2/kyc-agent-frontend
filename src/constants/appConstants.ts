export const CUSTOMER_STATUSES = [
  "active",
  "banned",
  "kyc_income",
  "kyc_identity",
];

export const CUSTOMER_STATUS_COLORS = {
  active: "#027A48", // Green
  banned: "#DC2626", // Red
  kyc_income: "#F59E0B", // Amber
  kyc_identity: "#3B82F6", // Blue
} as const;
