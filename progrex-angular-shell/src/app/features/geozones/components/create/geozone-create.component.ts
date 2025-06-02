import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-geozone-create',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Create New GeoZone</h2>
    <p>This is where you would add a form to create a new GeoZone.</p>
    <!-- Placeholder for GeoZone creation form -->
  `,
  styles: [``]
})
export class GeoZoneCreateComponent {
  constructor() {}
}
