export type CustomerForm = {
  id: number;
  first_name: string;
  last_name: string;
  token: string;
  customer_id: number;
  created_at: string;
  status: 'valid_link' | 'expired_link' | 'successful_registration';
  form_urls: {
    frontend_form_url: string;
    submission_url: string;
  };
};
