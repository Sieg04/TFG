import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Indicator, IndicatorCreate } from '../models/indicator.model';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {
  private apiUrl = '/api/indicators'; // Assuming this is the base URL

  constructor(private http: HttpClient) {}

  getIndicators(skip?: number, limit?: number): Observable<Indicator[]> {
    let params = new HttpParams();
    if (skip !== undefined) {
      params = params.set('skip', skip.toString());
    }
    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get<Indicator[]>(this.apiUrl, { params });
  }

  getIndicator(id: number): Observable<Indicator> {
    return this.http.get<Indicator>(`${this.apiUrl}/${id}`);
  }

  createIndicator(indicatorData: IndicatorCreate): Observable<Indicator> {
    return this.http.post<Indicator>(this.apiUrl, indicatorData);
  }

  // Potential additional methods:
  // updateIndicator(id: number, indicatorData: Partial<IndicatorCreate>): Observable<Indicator> {
  //   return this.http.put<Indicator>(`${this.apiUrl}/${id}`, indicatorData);
  // }

  // deleteIndicator(id: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${id}`);
  // }
}
