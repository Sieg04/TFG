import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service'; // Corrected path
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink], // Added RouterLink here
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] // Corrected to styleUrls
})
export class DashboardComponent implements OnInit {
  userEmail: string | null = null;
  welcomeMessage: string = "Welcome to your Dashboard!";

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Attempt to get user information (e.g., email from token)
    // This is a simplified example. A real app would use a JWT decoding library
    // or fetch user details from a /api/users/me endpoint.
    const token = this.authService.getToken();
    if (token) {
      try {
        // WARNING: This is a very basic and unsafe way to decode a JWT.
        // A proper JWT library should be used in a real application.
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload && payload.sub) { // 'sub' (subject) often holds username or email in JWTs
          this.userEmail = payload.sub;
          this.welcomeMessage = `Welcome to your Dashboard, ${this.userEmail}!`;
        }
      } catch (e) {
        console.error('Error decoding token or token structure invalid:', e);
        // Fallback to generic welcome message if token is malformed or email not found
      }
    }
  }
}
