// Corresponds to DataSourceBase, DataSourceCreate, DataSource in schemas.py

export interface DataSourceBase {
  name: string;
  url?: string | null;
}

export interface DataSourceCreate extends DataSourceBase {}

export interface DataSource extends DataSourceBase {
  id: number;
}
