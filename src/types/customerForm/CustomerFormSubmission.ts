export type CustomerFormSubmissionRequest = {
  first_name: string;
  last_name: string;
  email?: string;
  date_of_birth: string;
  street_name: string;
  house_number: string;
  postal_code?: string;
  extra_address_details?: string;
  city_id: number;
  state_id?: number;
  country_id: number;
  gender: "male" | "female" | "other";
  country_phone_code: string;
  phone_number: string;
  status: "active" | "inactive";
};
