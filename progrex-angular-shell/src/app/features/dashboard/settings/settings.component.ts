import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Settings</h2>
    <p>This is the settings page.</p>
    <!-- Add more settings-related HTML here as needed -->
  `,
  styles: [``] // Add any styles if necessary
})
export class SettingsComponent {
  constructor() {}
}
