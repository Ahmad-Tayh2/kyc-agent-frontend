export type RecipientRemittanceMethod = {
  id: number;
  recipient_id: number;
  remittance_method_id: number;
  account_number?: string;
  country_phone_code?: string;
  phone_number?: string;
  formatted_phone?: string;
  recipient?: {
    id: number;
    reference_number: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    country_phone_code: string;
    phone_number: string;
  };
  remittance_method?: {
    id: number;
    name: string;
    description: string;
    enabled: boolean;
  };
  created_at?: string;
  updated_at?: string;
};

export type CreateRecipientRemittanceMethodRequest = {
  recipient_id: number;
  remittance_method_id: number;
  account_number?: string;
  country_phone_code?: string;
  phone_number?: string;
};

export type UpdateRecipientRemittanceMethodRequest = {
  recipient_id?: number;
  remittance_method_id?: number;
  account_number?: string;
  country_phone_code?: string;
  phone_number?: string;
};

export type GetRecipientRemittanceMethodsParams = {
  recipient_id: number;
};
