// Corresponds to CountryBase, CountryCreate, Country in schemas.py

export interface CountryBase {
  iso_code: string;
  name: string;
  region?: string | null;
  currency?: string | null;
}

export interface CountryCreate extends CountryBase {}

export interface Country extends CountryBase {
  id: number;
}
