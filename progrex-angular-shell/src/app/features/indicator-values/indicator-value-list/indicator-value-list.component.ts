import { Component, OnInit, ViewChild } from '@angular/core'; // Added ViewChild
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IndicatorValueService } from '../../../core/services/indicator-value.service';
import { CountryService } from '../../../core/services/country.service';
import { IndicatorService } from '../../../core/services/indicator.service';
import { IndicatorValue } from '../../../core/models/indicator-value.model';
import { Country } from '../../../core/models/country.model';
import { Indicator } from '../../../core/models/indicator.model';
import { forkJoin } from 'rxjs';
import { IndicatorChartComponent } from '../indicator-chart/indicator-chart.component'; // Import chart component

interface DisplayIndicatorValue extends IndicatorValue {
  countryName?: string;
  indicatorName?: string;
}

@Component({
  selector: 'app-indicator-value-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, IndicatorChartComponent], // Add IndicatorChartComponent
  templateUrl: './indicator-value-list.component.html',
  styleUrls: ['./indicator-value-list.component.css']
})
export class IndicatorValueListComponent implements OnInit {
  public filterForm: FormGroup;
  public indicatorValues: DisplayIndicatorValue[] = [];
  public countries: Country[] = [];
  public indicators: Indicator[] = [];

  public isLoading: boolean = false;
  public initialDataLoading: boolean = true;
  public errorMessage: string | null = null;

  // Chart related properties
  public showChart: boolean = false;
  public chartData: IndicatorValue[] = []; // Use IndicatorValue[] for chartData
  public selectedIndicatorNameForChart: string = 'Indicator Trend';
  public selectedCountryNameForChart: string = '';


  constructor(
    private fb: FormBuilder,
    private indicatorValueService: IndicatorValueService,
    private countryService: CountryService,
    private indicatorService: IndicatorService
  ) {
    this.filterForm = this.fb.group({
      countryId: [null],
      indicatorId: [null]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.filterForm.valueChanges.subscribe(() => {
      this.loadIndicatorValues();
    });
  }

  loadInitialData(): void {
    this.initialDataLoading = true;
    this.errorMessage = null;
    forkJoin({
      countries: this.countryService.getCountries(),
      indicators: this.indicatorService.getIndicators()
    }).subscribe({
      next: (data) => {
        this.countries = data.countries;
        this.indicators = data.indicators;
        this.initialDataLoading = false;
        // Optionally, load all indicator values initially or prompt user to select filters
        // For now, we'll wait for filter selection
      },
      error: (err) => {
        console.error('Error loading initial filter data:', err);
        this.errorMessage = 'Failed to load filter options. Please try again later.';
        this.initialDataLoading = false;
      }
    });
  }

  loadIndicatorValues(): void {
    const { countryId, indicatorId } = this.filterForm.value;

    // Only load if at least one filter is selected, or adjust as needed
    if (!countryId && !indicatorId) {
      this.indicatorValues = [];
      // Optional: show a message to select filters
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.indicatorValueService.getIndicatorValues(
      countryId ? +countryId : undefined,
      indicatorId ? +indicatorId : undefined
    ).subscribe({
      next: (data) => {
        this.indicatorValues = data.map(value => ({
          ...value,
          countryName: this.countries.find(c => c.id === value.country_id)?.name || 'Unknown Country',
          indicatorName: this.indicators.find(i => i.id === value.indicator_id)?.name || 'Unknown Indicator'
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching indicator values:', err);
        this.errorMessage = 'Failed to load indicator values. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  clearFilters(): void {
    this.filterForm.reset({ countryId: null, indicatorId: null });
    this.indicatorValues = [];
    this.hideChart(); // Hide chart when filters are cleared
  }

  viewChart(): void {
    if (this.indicatorValues.length > 0) {
      this.chartData = [...this.indicatorValues]; // Pass a copy of the current data

      const selectedCountryId = this.filterForm.get('countryId')?.value;
      const selectedIndicatorId = this.filterForm.get('indicatorId')?.value;

      this.selectedCountryNameForChart = this.countries.find(c => c.id === +selectedCountryId)?.name || '';
      const indicatorDetails = this.indicators.find(i => i.id === +selectedIndicatorId);
      this.selectedIndicatorNameForChart = indicatorDetails ? `${indicatorDetails.name} (${indicatorDetails.code})` : 'Indicator Trend';
      
      if (this.selectedCountryNameForChart) {
        this.selectedIndicatorNameForChart += ` - ${this.selectedCountryNameForChart}`;
      }

      this.showChart = true;
    }
  }

  hideChart(): void {
    this.showChart = false;
    this.chartData = [];
  }
}
