import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngIf, *ngFor, etc.
import { NgChartsModule } from 'ng2-charts'; // Required for charts
import { UruguayDataService } from '../../services/uruguay-data.service';
import { Country, Indicator, IndicatorValue, CountryEconomicProfile, EconomicProfileData } from '../../models/uruguay-data.models';
import { switchMap, tap, catchError, of, forkJoin, Observable, map } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-uruguay-dashboard-page',
  // Imports array for standalone component, but this component is part of UruguayDashboardModule
  // If it were standalone, it would be:
  // standalone: true,
  // imports: [CommonModule, NgChartsModule],
  templateUrl: './uruguay-dashboard-page.component.html',
  styleUrls: ['./uruguay-dashboard-page.component.css']
})
export class UruguayDashboardPageComponent implements OnInit {
  private uruguayDataService = inject(UruguayDataService);

  isLoading: boolean = true;
  errorLoading: string | null = null;

  country: Country | undefined;
  economicProfile: CountryEconomicProfile | undefined;

  // Chart data properties
  gdpCurrentChartData: ChartData<'line'> | undefined;
  gdpGrowthChartData: ChartData<'bar'> | undefined;
  inflationChartData: ChartData<'line'> | undefined;
  gdpConstantChartData: ChartData<'line'> | undefined; // For NY.GDP.MKTP.KD

  // Chart options
  public gdpCurrentChartOptions: ChartOptions<'line'> = {
    responsive: true, maintainAspectRatio: false,
    scales: { x: { title: { display: true, text: 'Year' } }, y: { title: { display: true, text: 'GDP (Current US$)' } } }
  };
  public gdpGrowthChartOptions: ChartOptions<'bar'> = {
    responsive: true, maintainAspectRatio: false,
    scales: { x: { title: { display: true, text: 'Year' } }, y: { title: { display: true, text: 'GDP Growth (Annual %)' } } }
  };
  public inflationChartOptions: ChartOptions<'line'> = {
    responsive: true, maintainAspectRatio: false,
    scales: { x: { title: { display: true, text: 'Year' } }, y: { title: { display: true, text: 'Inflation (CPI Annual %)' } } }
  };
  public gdpConstantChartOptions: ChartOptions<'line'> = {
    responsive: true, maintainAspectRatio: false,
    scales: { x: { title: { display: true, text: 'Year' } }, y: { title: { display: true, text: 'GDP (Constant 2015 US$)' } } }
  };

  // Helper to get typed economic data for the template
  get profileData(): EconomicProfileData | null {
    if (this.economicProfile && typeof this.economicProfile.economic_data !== 'string') {
      return this.economicProfile.economic_data as EconomicProfileData;
    }
    return null;
  }

  ngOnInit(): void {
    this.loadAllUruguayData();
  }

  private formatChartData(values: IndicatorValue[], label: string, color: string, chartType: 'line' | 'bar' = 'line'): ChartData<any> {
    const sortedValues = values.sort((a, b) => new Date(a.date).getFullYear() - new Date(b.date).getFullYear());
    const dataset: any = {
      label: label,
      data: sortedValues.map(v => v.value),
      fill: false,
      tension: 0.1
    };

    if (chartType === 'line') {
      dataset.borderColor = color;
    } else if (chartType === 'bar') {
      dataset.backgroundColor = `${color}B3`; // Add some transparency for bar charts
      dataset.borderColor = color;
      dataset.borderWidth = 1;
    }

    return {
      labels: sortedValues.map(v => v.date.substring(0, 4)), // Extract year
      datasets: [dataset]
    };
  }

  private fetchIndicatorDataAndUpdateChart(
    countryId: number,
    indicatorCode: string,
    chartLabel: string,
    color: string,
    chartType: 'line' | 'bar' = 'line',
    targetChartProperty: 'gdpCurrentChartData' | 'gdpConstantChartData' | 'gdpGrowthChartData' | 'inflationChartData',
    startDate?: string,
    endDate?: string
  ): Observable<boolean> { // Returns true on success, false on error/no data

    // Default to last 20 years if no start/end date provided
    const currentFullYear = new Date().getFullYear();
    const defaultEndDate = `${currentFullYear}-12-31`;
    const defaultStartDate = `${currentFullYear - 20}-01-01`;

    return this.uruguayDataService.getIndicatorByCode(indicatorCode).pipe(
      switchMap(indicator => {
        if (!indicator) {
          console.warn(`Indicator ${indicatorCode} not found!`);
          this.errorLoading = (this.errorLoading ? this.errorLoading + '; ' : '') + `Indicator ${indicatorCode} not found.`;
          return of(false);
        }
        return this.uruguayDataService.getIndicatorValues(countryId, indicator.id, startDate || defaultStartDate, endDate || defaultEndDate).pipe(
          map(values => {
            if (!values || values.length === 0) {
              console.warn(`No values found for indicator ${indicatorCode}`);
              (this as any)[targetChartProperty] = undefined; // Clear chart if no data
              return true; // Still success in terms of API call, just no data
            }
            (this as any)[targetChartProperty] = this.formatChartData(values, chartLabel, color, chartType);
            return true;
          }),
          catchError(err => {
            console.error(`Error fetching values for ${indicatorCode}:`, err);
            this.errorLoading = (this.errorLoading ? this.errorLoading + '; ' : '') + `Error loading data for ${chartLabel}.`;
            return of(false);
          })
        );
      }),
      catchError(err => {
        console.error(`Error fetching details for ${indicatorCode}:`, err);
        this.errorLoading = (this.errorLoading ? this.errorLoading + '; ' : '') + `Error loading details for ${indicatorCode}.`;
        return of(false);
      })
    );
  }

  loadAllUruguayData(): void {
    this.isLoading = true;
    this.errorLoading = null;
    const uruguayIsoCode = 'URY';

    this.uruguayDataService.getCountryByIsoCode(uruguayIsoCode).pipe(
      tap(country => {
        this.country = country;
        console.log('Country:', country);
      }),
      switchMap(country => {
        if (!country) {
          this.isLoading = false;
          this.errorLoading = 'Uruguay (URY) not found. Cannot load data.';
          console.error(this.errorLoading);
          return of(null); // Stop further execution
        }

        const economicProfile$ = this.uruguayDataService.getEconomicProfile(country.id).pipe(
          tap(profile => this.economicProfile = profile),
          catchError(err => {
            console.error('Error fetching economic profile:', err);
            this.errorLoading = (this.errorLoading ? this.errorLoading + '; ' : '') + 'Failed to load economic profile.';
            return of(null); // Continue even if profile fails
          })
        );

        const gdpCurrent$ = this.fetchIndicatorDataAndUpdateChart(country.id, 'NY.GDP.MKTP.CD', 'GDP (Current US$)', '#42A5F5', 'line', 'gdpCurrentChartData');
        const gdpConstant$ = this.fetchIndicatorDataAndUpdateChart(country.id, 'NY.GDP.MKTP.KD', 'GDP (Constant 2015 US$)', '#66BB6A', 'line', 'gdpConstantChartData');
        const gdpGrowth$ = this.fetchIndicatorDataAndUpdateChart(country.id, 'NY.GDP.MKTP.KD.ZG', 'GDP Growth (Annual %)', '#FFA726', 'bar', 'gdpGrowthChartData');
        const inflation$ = this.fetchIndicatorDataAndUpdateChart(country.id, 'FP.CPI.TOTL.ZG', 'Inflation (CPI Annual %)', '#EF5350', 'line', 'inflationChartData');

        return forkJoin([economicProfile$, gdpCurrent$, gdpConstant$, gdpGrowth$, inflation$]);
      }),
      catchError(err => {
        this.isLoading = false;
        this.errorLoading = 'An unexpected error occurred while loading country data.';
        console.error('Overall error in loadAllUruguayData:', err);
        return of(null); // Final catch for upstream errors (e.g., getCountryByIsoCode)
      })
    ).subscribe({
      next: (results) => {
        if (results) { // results could be null if country not found
          console.log('All data loading operations completed.');
        }
        this.isLoading = false;
      },
      error: (err) => { // This error callback might be redundant due to inner catchErrors, but good for safety.
        this.isLoading = false;
        this.errorLoading = this.errorLoading || 'An unexpected error occurred.';
        console.error('Subscription error in loadAllUruguayData:', err);
      }
    });
  }
}
