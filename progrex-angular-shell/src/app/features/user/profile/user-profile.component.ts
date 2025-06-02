import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>User Profile</h2>
    <p>This page will display user profile information and allow editing.</p>
    <!-- Placeholder for user profile details -->
  `,
  styles: [``]
})
export class UserProfileComponent {
  constructor() {}
}
