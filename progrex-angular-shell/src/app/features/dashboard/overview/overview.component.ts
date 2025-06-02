import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Import RouterLink
import { CountryService } from '../../../core/services/country.service';
// Country model might not be strictly needed if we only use .length

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink], // Add RouterLink
  template: `
    <h2>Dashboard Overview</h2>
    <div *ngIf="isLoading">Loading country data...</div>
    <div *ngIf="errorMessage">
      <p style="color: red;">{{ errorMessage }}</p>
    </div>
    <div *ngIf="!isLoading && !errorMessage">
      <h3>Country Summary</h3>
      <p>Total Countries in System: {{ countryCount }}</p>
      <p><a routerLink="/countries">View All Countries</a></p>
    </div>
    <hr>
    <p>More overview content will go here.</p>
  `,
  styles: [``]
})
export class OverviewComponent implements OnInit {
  countryCount: number = 0;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private countryService: CountryService) {
    // Removed log: console.log('[OverviewComponent] Constructor called');
  }

  ngOnInit(): void {
    // Removed log: console.log('[OverviewComponent] ngOnInit called');
    this.isLoading = true;
    this.countryService.getCountries().subscribe({ // Get all countries
      next: (countries) => {
        // Removed log: console.log('[OverviewComponent] Countries fetched:', countries);
        this.countryCount = countries.length;
        // Removed log: console.log(`[OverviewComponent] Country count set to: ${this.countryCount}`);
        this.isLoading = false;
        // Removed log: console.log('[OverviewComponent] isLoading set to false.');
      },
      error: (err) => {
        // Original console.error can be kept or removed. For now, let's assume it's kept as it's good practice for unhandled errors.
        console.error('Error fetching countries for overview:', err);
        this.errorMessage = 'Could not load country data.';
        this.isLoading = false;
        // Removed log: console.log('[OverviewComponent] isLoading set to false after error.');
      }
    });
  }
}
