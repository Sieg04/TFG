import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, TokenResponse } from '../../../core/services/auth.service'; // Adjusted path
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Import necessary modules for standalone
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      // email: ['', [Validators.required, Validators.email]], // Backend expects username
      username: ['', [Validators.required]], // Changed from email to username
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.errorMessage = null;
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: TokenResponse) => {
          // Assuming TokenResponse has an 'access' property based on AuthService
          if (response && response.access) {
            this.authService.saveToken(response.access);
            // Navigate to a placeholder dashboard route
            this.router.navigate(['/dashboard']);
          } else {
            // Handle cases where token might be missing in response
            this.errorMessage = 'Login successful, but no token received.';
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          if (err.status === 401 || err.status === 400) { // Common error codes for login failure
            this.errorMessage = 'Invalid credentials. Please try again.';
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again later.';
          }
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }
}
