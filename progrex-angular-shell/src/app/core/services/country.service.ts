import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country, CountryCreate } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private apiUrl = '/api/countries'; // Assuming this is the base URL for countries

  constructor(private http: HttpClient) {}

  getCountries(skip?: number, limit?: number): Observable<Country[]> {
    let params = new HttpParams();
    if (skip !== undefined) {
      params = params.set('skip', skip.toString());
    }
    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get<Country[]>(this.apiUrl, { params });
  }

  getCountry(id: number): Observable<Country> {
    return this.http.get<Country>(`${this.apiUrl}/${id}`);
  }

  createCountry(countryData: CountryCreate): Observable<Country> {
    return this.http.post<Country>(this.apiUrl, countryData);
  }

  // Potential additional methods based on typical CRUD operations:
  // updateCountry(id: number, countryData: Partial<CountryCreate>): Observable<Country> {
  //   return this.http.put<Country>(`${this.apiUrl}/${id}`, countryData);
  // }

  // deleteCountry(id: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/${id}`);
  // }
}
