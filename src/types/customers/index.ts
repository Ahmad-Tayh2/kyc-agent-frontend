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
  created_at: string;
  status: string;
};
