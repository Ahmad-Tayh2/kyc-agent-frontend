import { API_URLS } from "@/constants/api";

export interface Country {
  id: number;
  name: string;
  code: string;
}

export interface City {
  id: number;
  name: string;
  country_id: number;
}

export const addressService = {
  // Get all countries
  getCountries: async (): Promise<Country[]> => {
    try {
      const response = await fetch(API_URLS.address.countries);
      if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error("Error fetching countries:", error);
      throw error;
    }
  },

  // Get cities by country ID
  getCitiesByCountry: async (countryId: string | number): Promise<City[]> => {
    try {
      const response = await fetch(API_URLS.address.citiesByCountry(countryId));
      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error("Error fetching cities:", error);
      throw error;
    }
  },
};
