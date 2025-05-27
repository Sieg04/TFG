import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs'; // Import 'of' for the logout method
import { tap } from 'rxjs/operators';

// Interfaces
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegistrationData {
  username: string;
  email: string;
  password_1: string;
  password_2: string;
  first_name?: string;
  last_name?: string;
  company?: string; // Added company field
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

  constructor(private http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<TokenResponse> {
    // Django's token endpoint usually expects form data or application/json
    // For form data:
    // const formData = new FormData();
    // formData.append('username', credentials.username);
    // formData.append('password', credentials.password);
    // return this.http.post<TokenResponse>(`${this.apiUrl}/token/`, formData)
    
    // For application/json:
    return this.http.post<TokenResponse>(`${this.apiUrl}/token/`, credentials)
      .pipe(
        tap(response => {
          if (response && response.access) {
            this.saveToken(response.access);
            // Potentially save refresh token or user details from response
          }
        })
      );
  }

  register(userData: RegistrationData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, userData);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);
    // Potentially notify other parts of the application or redirect
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
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
