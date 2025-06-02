import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; // Ensure HttpParams is imported
import { Observable, of } from 'rxjs'; // Import 'of' for the logout method
import { tap } from 'rxjs/operators';

// Interfaces
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegistrationData {
  email: string;
  password: string; // Changed from password_1
  full_name?: string; // Added
  company?: string;
  // Removed username, password_2, first_name, last_name
}

export interface TokenResponse {
  access_token: string; // Correct field name
  token_type: string;
  refresh?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_INFO_KEY = 'userInfo'; // Placeholder for more user info if needed

  // Adjust the API base URL as per your environment or proxy configuration
  private apiUrl = '/api/users'; // Assuming /api is proxied

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  login(credentials: LoginCredentials): Observable<TokenResponse> {
    const body = new HttpParams()
      .set('username', credentials.username)
      .set('password', credentials.password);

    return this.http.post<TokenResponse>(`${this.apiUrl}/token/`, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded') // Explicitly set, though HttpParams usually does this.
    })
      .pipe(
        tap(response => {
          if (response && response.access_token) {
            this.saveToken(response.access_token);
            // Potentially save refresh token or user details from response
          }
        })
      );
  }

  register(userData: RegistrationData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, userData);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_INFO_KEY);
    }
    // Potentially notify other parts of the application or redirect
  }

  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    // Basic check for token existence.
    // For actual validity, a JWT library would be needed to check expiration.
    return !!token;
  }

  getUserRole(): string | null {
    // Placeholder: In a real app, decode the JWT to get roles/permissions.
    // For now, if authenticated, return a default role or fetch from USER_INFO_KEY
    if (this.isAuthenticated()) {
      // const userInfo = JSON.parse(localStorage.getItem(this.USER_INFO_KEY) || '{}');
      // return userInfo.role || 'user'; // Example
      return 'user'; // Hardcoded for now
    }
    return null;
  }
}
