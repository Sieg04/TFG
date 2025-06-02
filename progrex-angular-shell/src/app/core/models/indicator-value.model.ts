// Corresponds to IndicatorValueBase, IndicatorValueCreate, IndicatorValue in schemas.py

export interface IndicatorValueBase {
  country_id: number;
  indicator_id: number;
  source_id: number;
  date: string; // ISO date string (e.g., "YYYY-MM-DD")
  value: number;
}

export interface IndicatorValueCreate extends IndicatorValueBase {}

export interface IndicatorValue extends IndicatorValueBase {
  id: number;
}
