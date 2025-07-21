export type CustomerFormValidationResponse = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  country_phone_code: string | null;
  phone_number: string | null;
  token: string;
  status: 'valid_link' | 'expired_link' | 'successful_registration';
  expired_at: string;
  created_at: string;
  updated_at: string;
  generated_by_user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  form_urls: {
    validation_url: string;
    submission_url: string;
    frontend_form_url: string;
  };
  instructions: {
    step_1: string;
    step_2: string;
    note: string;
  };
};
