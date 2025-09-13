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
}

export interface CustomerIdentityFileData {
  documentType: string;
  documentNumber: string;
  documentIssueDate: string;
  documentExpiryDate: string;
  frontDocument: File | null;
  backDocument: File | null;
}

export interface CustomerIncomeFileData {
  bankStatements: File[];
  extraDocuments: File[];
  extraDocumentsDescription?: string;
}
