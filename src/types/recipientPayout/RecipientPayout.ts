export type RecipientPayout = {
  id: number;
  recipient_id: number;
  payout_agent_id: number;
  account_number: string;
  country_phone_code: string;
  phone_number: string;
  formatted_phone: string;
  recipient: {
    id: number;
    reference_number: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    country_phone_code: string;
    phone_number: string;
  };
  payout_agent: {
    id: number;
    business_name: string;
    code: string;
    address: {
      location: string;
      country: string;
    };
    description: string | null;
    enabled: boolean | null;
  };
  created_at: string;
  updated_at: string;
};

export type CreateRecipientPayoutRequest = {
  recipient_id: number;
  payout_agent_id: number;
};

export type UpdateRecipientPayoutRequest = Partial<CreateRecipientPayoutRequest>;

export type RecipientPayoutListResponse = {
  status: boolean;
  message: string;
  data: RecipientPayout[];
  errors: null | unknown;
};

export type RecipientPayoutResponse = {
  status: boolean;
  message: string;
  data: RecipientPayout;
  errors: null | unknown;
};

export type RecipientPayoutFilters = {
  recipient_id?: number;
};