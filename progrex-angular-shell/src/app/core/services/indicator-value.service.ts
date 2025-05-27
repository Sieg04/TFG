import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IndicatorValue, IndicatorValueCreate } from '../models/indicator-value.model';

@Injectable({
  providedIn: 'root'
})
export class IndicatorValueService {
  private apiUrl = '/api/indicatorvalues'; // Assuming this is the base URL

  constructor(private http: HttpClient) {}

  getIndicatorValues(
    countryId?: number,
    indicatorId?: number,
    skip?: number,
    limit?: number
  ): Observable<IndicatorValue[]> {
    let params = new HttpParams();
    if (countryId !== undefined) {
      params = params.set('country_id', countryId.toString());
    }
    if (indicatorId !== undefined) {
      params = params.set('indicator_id', indicatorId.toString());
    }
    if (skip !== undefined) {
      params = params.set('skip', skip.toString());
    }
    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }
    // The actual backend endpoint might be different, e.g., /api/indicator-values/
    // or nested under countries or indicators.
    // For now, using a flat /api/indicatorvalues with query parameters.
    return this.http.get<IndicatorValue[]>(this.apiUrl, { params });
  }

  createIndicatorValue(indicatorValueData: IndicatorValueCreate): Observable<IndicatorValue> {
    return this.http.post<IndicatorValue>(this.apiUrl, indicatorValueData);
  }

  // Potential additional methods:
  // getIndicatorValue(id: number): Observable<IndicatorValue> {
  //   return this.http.get<IndicatorValue>(`${this.apiUrl}/${id}`);
  // }

  // updateIndicatorValue(id: number, indicatorValueData: Partial<IndicatorValueCreate>): Observable<IndicatorValue> {
  //   return this.http.put<IndicatorValue>(`${this.apiUrl}/${id}`, indicatorValueData);
  // }

  // deleteIndicatorValue(id: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${id}`);
  // }
}
