import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Dashboard Overview</h2>
    <p>This is the dashboard overview page.</p>
  `,
  styles: [``]
})
export class OverviewComponent {
  constructor() {}
}
