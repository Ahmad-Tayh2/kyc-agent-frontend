// Customer creation and update types
export interface CustomerCreateData {
  // Basic Details
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  street_name: string;
  house_number: string;
  postal_code: string;
  extra_address_details: string;
  city_id: string;
  state_id: string;
  country_id: string;
  gender: undefined;
  country_phone_code: string;
  phone_number: string;
  status: string;
}

export interface CustomerSearchParams {
  customerNumber?: string;
  email?: string;
  phoneNumber?: string;
  phoneCode?: string;
}

export interface CustomerIdentityFileData {
  document_type: string;
  document_number: string;
  issuing_date: string;
  expiry_date: string;
  front_image: File | null;
  back_image: File | null;
  //got from api in get request
  front_file_url?: string;
  back_file_url?: string | null;
  id?: number;
}

export interface CustomerIncomeFileData {
  document: File[];
  document_type: string;
}
