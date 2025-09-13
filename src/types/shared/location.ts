export interface Country {
  id: number | string;
  name: string;
  code: string;
  phone_code: string;
  iso2: string;
  iso3?: string;
}

export interface City {
  id: number;
  name: string;
  country_id: number | string;
}

export interface State {
  id: number;
  name: string;
  country_id: number | string;
}

export interface Address {
  id: number | string;
  street: string;
  city: City;
  state: State;
  country: Country;
  postal_code: string;
}
