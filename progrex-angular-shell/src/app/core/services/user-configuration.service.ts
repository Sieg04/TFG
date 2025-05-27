import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UserConfiguration,
  UserConfigurationCreate,
  UserConfigurationUpdate
} from '../models/user-configuration.model';

@Injectable({
  providedIn: 'root'
})
export class UserConfigurationService {
  private apiUrl = '/api/users/me/configurations'; // Specific endpoint for user configurations

  constructor(private http: HttpClient) {}

  getUserConfiguration(): Observable<UserConfiguration> {
    // The backend might return a single configuration object or a list.
    // Assuming it's a single object representing the current user's config.
    // If it can be null or needs to be created first, the backend might return 404 or an empty object.
    return this.http.get<UserConfiguration>(this.apiUrl);
  }

  upsertUserConfiguration(configData: UserConfigurationCreate): Observable<UserConfiguration> {
    // "Upsert" usually means create or update.
    // FastAPI typically uses PUT for create-or-replace or create-or-update.
    // If the backend expects POST for create and PUT for update, this might need two methods
    // or the backend handles POST as upsert. Assuming PUT for upsert.
    return this.http.put<UserConfiguration>(this.apiUrl, configData);
  }

  patchUserConfiguration(configUpdateData: UserConfigurationUpdate): Observable<UserConfiguration> {
    // PATCH is suitable for partial updates.
    return this.http.patch<UserConfiguration>(this.apiUrl, configUpdateData);
  }
}
