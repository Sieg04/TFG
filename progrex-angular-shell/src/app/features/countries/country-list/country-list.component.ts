import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // For potential future links
import { CountryService } from '../../../core/services/country.service';
import { Country } from '../../../core/models/country.model';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent implements OnInit {
  public countries: Country[] = [];
  public isLoading: boolean = true;
  public errorMessage: string | null = null;

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.countryService.getCountries().subscribe({
      next: (data) => {
        this.countries = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching countries:', err);
        this.errorMessage = 'Failed to load countries. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
