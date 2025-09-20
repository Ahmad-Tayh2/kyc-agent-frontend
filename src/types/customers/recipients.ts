import type { Address } from "@/types/shared/location";

export interface CustomerRecipient {
  id: number;
  reference_number: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  address: Address;
  gender: string;
  country_phone_code: string;
  phone_number: string;
  full_phone_number: string;
  created_at: string;
  updated_at: string;
  customers: any[];
}

export interface CustomerRecipientsResponse {
  data: CustomerRecipient[];
}

// For the simplified version used in send remittance
export interface CustomerRecipientSummary {
  id: number;
  first_name: string;
  last_name: string;
  country: {
    name: string;
    iso2: string;
    iso3: string;
  };
  country_phone_code: string;
  phone_number: string;
}
