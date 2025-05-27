// Corresponds to GeoZoneBase, GeoZoneCreate, GeoZone in schemas.py

export interface GeoZoneBase {
  name: string;
  description?: string | null;
  geojson_data: any; // GeoJSON object, can be Record<string, any> or a more specific type
}

export interface GeoZoneCreate extends GeoZoneBase {
  user_id?: number | null; // Optional owner
}

export interface GeoZone extends GeoZoneBase {
  id: number;
  user_id?: number | null;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}
