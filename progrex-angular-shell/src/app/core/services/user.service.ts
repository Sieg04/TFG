import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserCreate, UserUpdate } from '../models/user.model'; // Ensure these models are defined

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users'; // Standard base URL for user management by admins

  constructor(private http: HttpClient) {}

  getUsers(skip?: number, limit?: number): Observable<User[]> {
    let params = new HttpParams();
    if (skip !== undefined) {
      params = params.set('skip', skip.toString());
    }
    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get<User[]>(this.apiUrl, { params });
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(userData: UserCreate): Observable<User> {
    // This endpoint (/api/users POST) is for admin user creation.
    // It might have different validation or fields than the self-registration endpoint
    // handled by AuthService.register (which might be, for example, /api/auth/register or also /api/users with different logic based on auth).
    return this.http.post<User>(this.apiUrl, userData);
  }

  updateUser(id: number, userData: UserUpdate): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData);
  }

  // deleteUser(id: number): Observable<any> { // Optional, but common for admin user management
  //   return this.http.delete(`${this.apiUrl}/${id}`);
  // }
}
