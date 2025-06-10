// progrex-angular-shell/src/app/core/models/economic-profile.model.ts

export interface DataPoint {
  date: string; // Or Date, if conversion is handled
  value: number;
}

export interface StockMarketData {
  name: string;
  points: DataPoint[];
}

export interface RealEstateData {
  average_price_sqm_usd: number; // Matching the backend mock data key
  price_trend: DataPoint[];
}

export interface Company {
  name: string;
  valuation_billion_usd?: number; // Matching the backend mock data key
  sector?: string;
  // For leading_companies in EconomicSector, it might just be names
  // If so, this interface is primarily for unicorn_companies.
  // If leading_companies also have more details, this can be reused.
}

export interface EconomicSector {
  name: string;
  leading_companies: Company[] | string[]; // Allowing simple string array or more detailed Company objects
}

export interface EconomicData {
  stock_market: StockMarketData;
  real_estate: RealEstateData;
  economy_type: string;
  main_sectors: EconomicSector[];
  unicorn_companies: Company[];
}

export interface CountryEconomicProfile {
  id: number;
  country_id: number;
  economic_data: EconomicData | string; // Allow string initially, to be parsed
  created_at: string; // Or Date
  updated_at: string; // Or Date
}
