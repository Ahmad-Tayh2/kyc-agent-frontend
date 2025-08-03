interface Address {
  street_name: string;
  house_number: string;
  postal_code: string;
  extra_address_details: string;
  city: { id: number; name: string };
  state: { id: number; name: string };
  country: { id: number; name: string };
}
interface AddressUpdated {
  street_name?: string;
  house_number?: string;
  postal_code?: string;
  extra_address_details?: string;
  city_id?: number;
  state_id?: number;
  country_id?: number;
}

interface BankDetails {
  bank_name: string;
  account_number: string;
  swift_code: string;
  account_type: string;
  iban: string;
  bic_code: string;
  bank_address: string;
}

interface Customer {
  id: number;
  reference_number: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  date_of_birth: string;
  street_name: string;
  house_number: string;
  postal_code: string;
  extra_address_details: string;
  city: { id: number; name: string };
  state: { id: number; name: string };
  gender: string;
  country_phone_code: string;
  phone_number: string;
  full_phone_number: string;
  recipient_count: number;
  country: { id: number; name: string; iso2: string; iso3: string };
  added_by: { id: number; name: string };
  status: string;
  created_at: string;
  updated_at: string;
}

interface RemittanceMethod {
  id: number;
  name: string;
}

export interface RecipientDataType {
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
  bank_details: BankDetails;
  customers: Customer[];
  remittance_methods: RemittanceMethod[];
  created_at: string;
  updated_at: string;
}

export interface RecipientUpdatedDataType {
  id: number;
  reference_number: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  address: AddressUpdated;
  gender: string;
  country_phone_code: string;
  phone_number: string;
  full_phone_number: string;
  bank_details: BankDetails;
  customers: Customer[];
  remittance_methods: RemittanceMethod[];
  created_at: string;
  updated_at: string;
}
