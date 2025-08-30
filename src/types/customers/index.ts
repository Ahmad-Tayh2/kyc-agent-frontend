export type CustomerType = {
  id: string;
  reference_number: string;
  first_name: string;
  last_name: string;
  full_name: string;
  country: {
    name: string;
  };
  phone_number: string;
  country_phone_code?: string;
  created_at: string;
  status: string;
};

// Re-export customer recipients types for easy access
export type {
  CustomerRecipient,
  CustomerRecipientsResponse,
  CustomerRecipientSummary,
} from './recipients';

// Re-export customer form types for easy access
export type {
  CustomerCreateData,
  CustomerIdentityFileData,
  CustomerIncomeFileData,
  CustomerSearchParams,
} from './forms';
