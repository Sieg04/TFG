// Corresponds to UserConfigurationBase, UserConfigurationCreate, UserConfigurationUpdate, UserConfiguration in schemas.py

export interface UserConfigurationBase {
  configurations: any; // JSON structure, can be Record<string, any> or a more specific type if known
}

export interface UserConfigurationCreate extends UserConfigurationBase {}

export interface UserConfigurationUpdate {
  configurations?: any | null;
}

export interface UserConfiguration extends UserConfigurationBase {
  id: number;
  user_id: number;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}
