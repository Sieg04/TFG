import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegistrationData } from '../../../core/services/auth.service'; // Adjusted path
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Import necessary modules for standalone
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]], // For client-side validation
      full_name: [''],
      company: ['']
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.registerForm.valid) {
      const { email, password, full_name, company } = this.registerForm.value; // Removed username, password_1, password_2
      const registrationData: RegistrationData = {
        email,
        password, // Use password from form
        full_name: full_name || undefined,
        company: company || undefined,
        // password_2 and first_name/last_name logic removed
      };

      this.authService.register(registrationData).subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
          // Optionally, show a success message before navigation
        },
        error: (err) => {
          console.error('Registration error:', err);
          if (err.error) {
            // Attempt to parse and display backend error messages
            let backendErrors = err.error;
            if (typeof backendErrors === 'string') {
                 try { backendErrors = JSON.parse(backendErrors); } catch (e) { /* ignore */ }
            }

            if (backendErrors.detail) { // FastAPI validation errors often in detail
                if (typeof backendErrors.detail === 'string') {
                    this.errorMessage = backendErrors.detail;
                } else if (Array.isArray(backendErrors.detail)) {
                    this.errorMessage = backendErrors.detail.map((e: any) => `${e.loc.join('.')} - ${e.msg}`).join('; ');
                } else {
                     this.errorMessage = "An error occurred during registration.";
                }
            } else if (backendErrors.email) { // username error handling removed
                this.errorMessage = `Email: ${backendErrors.email.join(', ')}`;
            } else if (backendErrors.password) { // Changed from password_1 to password
                this.errorMessage = `Password: ${backendErrors.password.join(', ')}`;
            } else {
                this.errorMessage = 'Registration failed. Please check your input and try again.';
            }
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again later.';
          }
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields correctly and ensure passwords match.';
       if (this.registerForm.errors?.['mismatch']) {
        this.errorMessage = 'Passwords do not match.';
      }
    }
  }
}
