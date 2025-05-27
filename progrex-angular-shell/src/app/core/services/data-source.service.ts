import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataSource, DataSourceCreate } from '../models/data-source.model';

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {
  private apiUrl = '/api/datasources'; // Assuming this is the base URL

  constructor(private http: HttpClient) {}

  getDataSources(skip?: number, limit?: number): Observable<DataSource[]> {
    let params = new HttpParams();
    if (skip !== undefined) {
      params = params.set('skip', skip.toString());
    }
    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get<DataSource[]>(this.apiUrl, { params });
  }

  getDataSource(id: number): Observable<DataSource> {
    return this.http.get<DataSource>(`${this.apiUrl}/${id}`);
  }

  createDataSource(dataSourceData: DataSourceCreate): Observable<DataSource> {
    return this.http.post<DataSource>(this.apiUrl, dataSourceData);
  }

  // Potential additional methods:
  // updateDataSource(id: number, dataSourceData: Partial<DataSourceCreate>): Observable<DataSource> {
  //   return this.http.put<DataSource>(`${this.apiUrl}/${id}`, dataSourceData);
  // }

  // deleteDataSource(id: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${id}`);
  // }
}
