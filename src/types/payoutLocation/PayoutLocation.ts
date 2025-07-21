export type PayoutLocation = {
  id: number;
  business_name: string;
  address: {
    street_name: string;
    house_number: string;
    postal_code: string;
    extra_details: string | null;
    city: {
      id: number;
      name: string;
    };
    country: {
      id: number;
      name: string;
    };
    state: {
      id: number;
      name: string;
    };
  };
  rating: number;
  isActive: boolean;
};
