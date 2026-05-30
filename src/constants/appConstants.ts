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

export const PAYMENT_METHODS = [
  "stripe",
  "paypal",
  "bank_transfer",
  "wallet",
  "worldpay",
];
export const TRASACTIONS_STATUSES = [
  "initiated",
  "in-progress",
  "completed",
  "cancelled",
  "blocked",
  "refunded",
];
export const TRASACTIONS_STATUSES_COLORS = {
  initiated: "#398EF0",
  "in-progress": "#9D7C5F",
  completed: "#027A48",
  cancelled: "#000000",
  blocked: "#000000",
  refunded: "#6941C6",
} as const;
export const TRASACTIONS_TYPES = [
  "transfer",
  "add_money",
  "withdraw_money",
  "exchange_money",
];

export const ADD_MONEY_TRANSACTIONS_STATUS = [
  "initiated",
  "processing",
  "completed",
  "failed",
  "cancelled",
];
export const ADD_MONEY_TRANSACTIONS_STATUS_COLORS = {
  initiated: "#398EF0",
  processing: "#9D7C5F",
  completed: "#027A48",
  failed: "#B42318",
  cancelled: "#000000",
};

// ── KYC Risk Levels ─────────────────────────────────────────────
export const KYC_RISK_LEVEL_COLORS: Record<string, string> = {
  low: "#027A48",
  medium: "#DF6B1D",
  high: "#B42318",
  critical: "#7A0000",
};

// ── KYC Verification Statuses ───────────────────────────────────
export const KYC_VERIFICATION_STATUS_COLORS: Record<string, string> = {
  pending: "#667085",
  in_progress: "#398EF0",
  verified: "#027A48",
  rejected: "#B42318",
  manual_review: "#DF6B1D",
};

// ── KYC Document Statuses ───────────────────────────────────────
export const KYC_DOCUMENT_STATUS_COLORS: Record<string, string> = {
  pending: "#667085",
  approved: "#027A48",
  rejected: "#B42318",
  expired: "#9D7C5F",
};

// ── KYC Document Type Labels ────────────────────────────────────
export const KYC_DOCUMENT_TYPE_LABELS: Record<string, string> = {
  passport: "Passport",
  national_id: "National ID",
  driving_license: "Driving License",
  proof_of_address: "Proof of Address",
  selfie: "Selfie",
  source_of_funds: "Source of Funds",
};
