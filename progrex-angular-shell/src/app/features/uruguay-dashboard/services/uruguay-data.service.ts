import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import {
  Country,
  Indicator,
  IndicatorValue,
  CountryEconomicProfile,
  EconomicProfileData
} from '../models/uruguay-data.models';

@Injectable({
  providedIn: 'root'
})
export class UruguayDataService {
  private http = inject(HttpClient);
  private apiUrl = '/api'; // Base API URL

  constructor() { }

  getCountryByIsoCode(isoCode: string): Observable<Country | undefined> {
    // This will fetch all countries and filter.
    // A more efficient backend endpoint /api/countries?iso_code=URY would be better.
    return this.http.get<Country[]>(`${this.apiUrl}/countries`).pipe(
      map(countries => countries.find(country => country.iso_code === isoCode))
    );
  }

  getIndicatorByCode(indicatorCode: string): Observable<Indicator | undefined> {
    // Similar to above, fetch all and filter.
    // A more efficient backend endpoint /api/indicators?code=CODE would be better.
    return this.http.get<Indicator[]>(`${this.apiUrl}/indicators`).pipe(
      map(indicators => indicators.find(indicator => indicator.code === indicatorCode))
    );
  }

  getIndicatorValues(
    countryId: number,
    indicatorId: number,
    startDate?: string,
    endDate?: string,
    limit: number = 1000
  ): Observable<IndicatorValue[]> {
    let params = new HttpParams()
      .set('country_id', countryId.toString())
      .set('indicator_id', indicatorId.toString())
      .set('limit', limit.toString());

    if (startDate) {
      params = params.set('start_date', startDate);
    }
    if (endDate) {
      params = params.set('end_date', endDate);
    }
    // Assuming the backend filters by country_id and indicator_id based on query params
    return this.http.get<IndicatorValue[]>(`${this.apiUrl}/indicator-values`, { params });
  }

  getEconomicProfile(countryId: number): Observable<CountryEconomicProfile> {
    return this.http.get<CountryEconomicProfile>(`${this.apiUrl}/countries/${countryId}/economic-profile`).pipe(
      map(profile => {
        if (profile && typeof profile.economic_data === 'string') {
          try {
            profile.economic_data = JSON.parse(profile.economic_data) as EconomicProfileData;
          } catch (error) {
            console.error('Failed to parse economic_data:', error);
            // Optionally, return profile as is or handle error differently
          }
        }
        return profile;
      })
    );
  }
}
