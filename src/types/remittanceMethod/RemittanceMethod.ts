export type RemittanceMethod = {
  id: number;
  name: string;
  description: string;
  validator_id?: number;
  validator?: {
    id: number;
    name: string;
  };
};

// Account verification types
export type AccountVerificationServiceData = {
  serviceCode: string;
  phoneNumber: string;
};

export type AccountVerificationData = {
  expected_account_name_prefix: string;
  expected_account_id_prefix: string;
};

export type AccountVerificationRequest = {
  validation_type: string;
  service_data: AccountVerificationServiceData;
  verification_data: AccountVerificationData;
};

export type AccountVerificationResponse = {
  status: boolean;
  message: string;
  data: {
    status: string;
  };
  errors: null | unknown;
};
