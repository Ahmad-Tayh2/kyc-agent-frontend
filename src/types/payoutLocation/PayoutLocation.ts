export type PayoutLocation = {
  id: number;
  business_name: string;
  address: {
    location?: string;
    country?: string;
  };
  rating: number;
  isActive: boolean;
};
