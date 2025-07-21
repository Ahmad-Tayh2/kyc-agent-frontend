import { API_URLS } from '@/constants/api';

export interface Country {
  id: number;
  name: string;
  code: string;
  phone_code: string;
  iso2: string;
}

export interface City {
  id: number;
  name: string;
  country_id: number;
}

export interface State {
  id: number;
  name: string;
  country_id: number;
}

export const addressService = {
  // Get all countries
  getCountries: async (): Promise<Country[]> => {
    const response = await fetch(API_URLS.address.countries);
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }
    const data = await response.json();
    return data.data || data;
  },

  // Get cities by country ID
  getCitiesByCountry: async (countryId: string | number): Promise<City[]> => {
    const response = await fetch(API_URLS.address.citiesByCountry(countryId));
    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }
    const data = await response.json();
    return data.data || data;
  },

  // Get states by country ID
  getStatesByCountry: async (countryId: string | number): Promise<State[]> => {
    const response = await fetch(API_URLS.address.states(countryId));
    if (!response.ok) {
      throw new Error('Failed to fetch states');
    }
    const data = await response.json();
    return data.data || data;
  },
};
