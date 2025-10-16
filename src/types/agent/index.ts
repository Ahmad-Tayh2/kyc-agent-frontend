export interface Country {
  id: number;
  name: string;
  iso2?: string;
  iso3?: string;
  phone_code?: string;
}

export interface State {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
}

export interface Address {
  street_name: string;
  house_number: string;
  postal_code?: string;
  extra_address_details?: string;
  city: City;
  state?: State;
  country: Country;
}

export interface BusinessDetails {
  business_name: string;
  street_name: string;
  house_number: string;
  postal_code?: string;
  extra_address_details?: string;
  city: City;
  state?: State;
  country: Country;
}

export interface Agent {
  id: number;
  reference_number: string;
  agent_type: "sales_person" | "business_partner";
  is_sending_partner: boolean;
  is_payout_partner: boolean;
  date_of_birth: string;
  gender: "male" | "female";
  sending_agent_group_id: number;
  payout_agent_group_id: number;
  commission: number;
  customer_count: number;
  transaction_count: number;
  wallet_balance: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
  business_details?: BusinessDetails;
  identity_file_path_1?: string | null;
  identity_file_path_2?: string | null;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  phone_number: string;
  status: string;
  two_factor_status: boolean;
  email_verified_at?: string;
  phone_verified_at?: string;
  country_id: number;
  country: Country;
  image?: string;
  address: Address;
  created_at: string;
  updated_at: string;
  agent: Agent;
  admin?: {
    id: number;
  };
}

export interface AgentGroup {
  id: number;
  name: string;
}

export interface AgentProfileResponse {
  status: boolean;
  message: string;
  data: {
    user: User;
    sending_agent_group: AgentGroup;
    payout_agent_group: AgentGroup;
  };
  errors?: string[];
}

export interface UpdateAgentProfileRequest {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    country_phone_code: string;
    address: {
      street_name: string;
      house_number: string;
      postal_code?: string;
      extra_address_details?: string;
      city_id: number;
      state_id?: number;
      country_id: number;
    };
  };
  agent_type: "sales_person" | "business_partner";
  is_sending_partner: boolean;
  is_payout_partner: boolean;
  date_of_birth: string;
  gender: "male" | "female";
  sending_agent_group_id?: number;
  payout_agent_group_id?: number;
  commission: number;
  business_details?: {
    business_name: string;
    street_name: string;
    house_number: string;
    postal_code?: string;
    extra_address_details?: string;
    city_id: number;
    state_id?: number;
    country_id: number;
  };
}

export interface ProfileFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
  countryCode: string;
  streetName: string;
  houseNumber: string;
  city: string;
  country: string;
  state: string;
  postalCode: string;
  extraAddressDetails: string;
  gender: "male" | "female" | "";

  // Business Information
  businessName: string;
  businessStreetName: string;
  businessHouseNumber: string;
  businessCity: string;
  businessCountry: string;
  businessState: string;
  businessPostalCode: string;
  businessExtraAddressDetails: string;

  // Agent Information
  agentType: "sales_person" | "business_partner";
  isSendingPartner: boolean;
  isPayoutPartner: boolean;
  sendingAgentGroupId?: number;
  payoutAgentGroupId?: number;
  commission: number;
}

export interface agentDocsData {
  files: File[];
  document_type: string;
}
