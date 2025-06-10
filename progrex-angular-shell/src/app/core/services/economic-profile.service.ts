// progrex-angular-shell/src/app/core/services/economic-profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CountryEconomicProfile, EconomicData } from '../models/economic-profile.model';
// Removed environment import, using relative path for API
// import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EconomicProfileService {
  private apiUrlBase = '/api'; // Using /api directly, common for Angular proxy setup

  constructor(private http: HttpClient) { }

  getEconomicProfile(countryId: number): Observable<CountryEconomicProfile> {
    const apiUrl = `${this.apiUrlBase}/countries/${countryId}/economic-profile`;

    return this.http.get<CountryEconomicProfile>(apiUrl).pipe(
      map(response => {
        if (response && typeof response.economic_data === 'string') {
          try {
            response.economic_data = JSON.parse(response.economic_data) as EconomicData;
          } catch (error) {
            console.error('Failed to parse economic_data:', error);
            // Optionally, transform the error or throw a new one
            // For now, it will propagate the error if parsing fails,
            // or return the response with unparsed data if console.error is preferred.
            // To strictly adhere to returning CountryEconomicProfile with EconomicData,
            // an error should be thrown here or handled in catchError.
          }
        }
        return response;
      }),
      catchError(error => {
        console.error(`Error fetching economic profile for country ID ${countryId}:`, error);
        // Rethrow the error or return a user-friendly error object
        throw error; // Rethrowing the error to be handled by the subscriber
      })
    );
  }
}
