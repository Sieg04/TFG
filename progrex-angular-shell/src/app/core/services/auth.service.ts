import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  access: string; // Common name for access token in JWT responses
  refresh?: string; // Optional refresh token
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
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    // Note: HttpClient will automatically set the Content-Type to multipart/form-data
    // when a FormData object is passed. For application/x-www-form-urlencoded,
    // we need to use HttpParams and set the Content-Type header manually.

    const body = new HttpParams()
      .set('username', credentials.username)
      .set('password', credentials.password);

    return this.http.post<TokenResponse>(`${this.apiUrl}/token`, body.toString(), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    }).pipe(
        tap(response => {
          if (response && response.access) {
            this.saveToken(response.access);
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
