import { API_URLS } from "@/constants/api";
import apiClient from "@/lib/axiosInstance";
import type { RecipientUpdatedDataType } from "@/types/recipients";

export interface RecipientSearchParams {
  name?: string;
  phone_number?: string;
  customer_id?: string;
  agent_id?: string;
  phone_code?: string;
}

export interface RecipientCreateData {
  // Basic Details
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  gender: string;
  country_phone_code: string;
  phone_number: string;

  // Address
  address: {
    street_name: string;
    house_number: string;
    postal_code: string;
    extra_address_details?: string;
    city_id: string;
    state_id?: string;
    country_id: string;
  };

  // Customer IDs
  customer_ids: number[];

  // Remittance Methods
  // remittance_methods: number[];
  rm_service_providers: {
    rm_sp_id: number;
    account_number?: string;
    country_phone_code?: string;
    phone_number?: string;
  }[];
}

export interface BankAccountCreateData {
  accountable_type: "Recipient";
  accountable_id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  street_name: string;
  house_number: string;
  postal_code: string;
  extra_address_details?: string;
  city_id: number;
  state_id?: number;
  country_id: number;
  bank_name: string;
  account_number: string;
  swift_code: string;
  currency_id: number;
  iban_code: string;
  bank_address: string;
}

export interface CustomerIdentityFileData {
  document_type: string;
  document_number: string;
  issuing_date: string;
  expiry_date: string;
  front_image: File | null;
  back_image: File | null;
}

export interface CustomerIncomeFileData {
  bankStatements: File[];
  extraDocuments: File[];
  extraDocumentsDescription?: string;
}

export const recipientsService = {
  getRecipients: async (filters: string = "") => {
    const response = await apiClient.get(API_URLS.recipients.get(filters));
    return response.data;
  },
  getRecipientById: async (id: string | number) => {
    const response = await apiClient.get(API_URLS.recipients.getById(id));
    return response.data;
  },
  updateRecipient: async (
    id: string | number,
    data: Partial<RecipientUpdatedDataType>
  ) => {
    const response = await apiClient.patch(
      API_URLS.recipients.update(id),
      data
    );
    return response.data;
  },
  searchRecipient: async (params: RecipientSearchParams) => {
    const queryParams = new URLSearchParams();

    if (params.phone_code) queryParams.append("phone_code", params.phone_code);
    if (params.phone_number)
      queryParams.append("phone_number", params.phone_number);
    if (params.name) queryParams.append("name", params.name);
    if (params.customer_id)
      queryParams.append("customer_id", params.customer_id);
    if (params.agent_id) queryParams.append("agent_id", params.agent_id);

    const response = await apiClient.get(
      API_URLS.recipients.search(queryParams.toString())
    );
    return response.data;
  },
  createRecipient: async (data: RecipientCreateData) => {
    const response = await apiClient.post(API_URLS.recipients.create, data);
    return response.data;
  },
};
