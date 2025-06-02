// Corresponds to IndicatorBase, IndicatorCreate, Indicator in schemas.py

export interface IndicatorBase {
  code: string;
  name: string;
  unit?: string | null;
}

export interface IndicatorCreate extends IndicatorBase {}

export interface Indicator extends IndicatorBase {
  id: number;
}
