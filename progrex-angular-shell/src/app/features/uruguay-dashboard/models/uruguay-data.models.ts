// uruguay-data.models.ts
export interface Country {
  id: number;
  iso_code: string;
  name: string;
  region?: string; // Added from previous knowledge of Country model
  currency?: string; // Added from previous knowledge of Country model
}

export interface Indicator {
  id: number;
  code: string;
  name: string;
  unit?: string;
}

export interface IndicatorValue {
  id: number;
  country_id: number;
  indicator_id: number;
  date: string; // Assuming date as string (e.g., "YYYY-MM-DD")
  value: number;
  source_id?: number; // Added from previous knowledge
}

export interface EconomicProfileData {
  country_iso_code: string;
  last_updated: string;
  gdp_by_sector_source_note?: string;
  employment_by_sector?: {
    source_note?: string;
    agriculture?: string;
    industry?: string;
    services?: string;
  };
  major_companies: { name: string; sector: string; description: string; }[];
  stock_market: { main_index: string; recent_trends: string; source_note?: string; };
  real_estate_market?: {
    general_trends?: string;
    key_areas?: string[];
    source_note?: string;
  };
  principal_trade_partners?: {
    exports?: string[];
    imports?: string[];
    source_note?: string;
  };
  public_spending_sectors?: {
    source_note?: string;
    social_security?: string;
    education?: string;
    health?: string;
    infrastructure?: string;
  };
  currency_details?: {
    currency_code?: string;
    currency_name?: string;
    central_bank?: string;
    exchange_rate_source?: string;
  };
  social_indicators_qualitative?: {
    human_development_index?: {
      value?: string;
      year?: string;
      rank?: string;
      source?: string;
    };
    poverty_rate_note?: string;
    gini_index_source_note?: string;
  };
  population_demographics_source_note?: string;
  [key: string]: any; // For flexibility
}

export interface CountryEconomicProfile {
  id: number;
  country_id: number;
  economic_data: EconomicProfileData | string; // It comes as string, needs parsing
  created_at: string;
  updated_at: string;
}
