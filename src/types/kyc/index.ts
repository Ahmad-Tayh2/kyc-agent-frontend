// ─── KYC Enums ──────────────────────────────────────────────────

export type KycRiskLevel = "low" | "medium" | "high" | "critical";
export type KycVerificationStatus =
  | "pending"
  | "in_progress"
  | "verified"
  | "rejected"
  | "manual_review";
export type KycDocumentType =
  | "passport"
  | "national_id"
  | "driving_license"
  | "proof_of_address"
  | "selfie"
  | "source_of_funds";
export type KycDocumentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "expired";

// ─── API Response Types ─────────────────────────────────────────

export interface KycDocument {
  id: number;
  kyc_profile_id: number;
  document_type: KycDocumentType;
  verification_status: KycDocumentStatus;
  provider_reference_id: string | null;
  rejection_reason: string | null;
  verified_at: string | null;
  expires_at: string | null;
  file_url: string | null;
  created_at: string;
}

export interface KycStatusResponse {
  profile_id: number;
  customer_id: number;
  risk_level: KycRiskLevel;
  verification_status: KycVerificationStatus;
  tier: { id: number; name: string } | null;
  required_checks: string[];
  completed_checks: string[];
  outstanding_checks: string[];
  is_fully_verified: boolean;
  can_transact: boolean;
  documents: KycDocument[];
}

// ─── Request Payload Types ──────────────────────────────────────

export interface UploadKycDocumentPayload {
  customer_id: number | string;
  document_type: KycDocumentType;
  document: File;
  expires_at?: string | null;
}
