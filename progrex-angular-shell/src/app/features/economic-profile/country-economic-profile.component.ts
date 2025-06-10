// progrex-angular-shell/src/app/features/economic-profile/country-economic-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http'; // Added HttpErrorResponse
import { EconomicProfileService } from '../../core/services/economic-profile.service';
import { CountryEconomicProfile, EconomicData, DataPoint, StockMarketData, RealEstateData } from '../../core/models/economic-profile.model';
import { ChartConfiguration, ChartOptions, ChartType, TooltipItem } from 'chart.js'; // Added TooltipItem

@Component({
  selector: 'app-country-economic-profile',
  templateUrl: './country-economic-profile.component.html',
  styleUrls: ['./country-economic-profile.component.css']
})
export class CountryEconomicProfileComponent implements OnInit {

  profile: CountryEconomicProfile | null = null;
  // Ensure EconomicData is properly typed if accessed directly from profile.economic_data
  economicData: EconomicData | null = null;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  countryId!: number; // Definite assignment assertion

  // Stock Market Chart
  public stockMarketChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  public stockMarketChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: false }
    },
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2);
            }
            return label;
          }
        }
      }
    }
  };
  public stockMarketChartType: ChartType = 'line';

  // Real Estate Chart
  public realEstateChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  public realEstateChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return '$' + value; // Add USD symbol
          }
        }
      }
    },
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += '$' + context.parsed.y.toFixed(2); // Add USD symbol
            }
            return label;
          }
        }
      }
    }
  };
  public realEstateChartType: ChartType = 'line';

  constructor(
    private route: ActivatedRoute,
    private economicProfileService: EconomicProfileService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('countryId');
    if (idParam) {
      this.countryId = +idParam; // Convert string to number
      this.loadEconomicProfile();
    } else {
      this.isLoading = false;
      this.errorMessage = 'Country ID not found in route parameters.';
      console.error(this.errorMessage);
    }
  }

  loadEconomicProfile(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.economicProfileService.getEconomicProfile(this.countryId).subscribe({
      next: (data: CountryEconomicProfile) => {
        this.profile = data;
        // Type guard for economic_data
        if (typeof data.economic_data === 'string') {
          // This should ideally be handled by the service, but as a fallback:
          console.warn('Economic data was a string, attempting to parse in component.');
          try {
            this.economicData = JSON.parse(data.economic_data) as EconomicData;
          } catch (e) {
            console.error('Failed to parse economic_data in component:', e);
            this.errorMessage = 'Failed to parse economic data.';
            this.economicData = null;
          }
        } else {
          this.economicData = data.economic_data as EconomicData;
        }

        if (this.economicData) {
          this.prepareStockMarketChart();
          this.prepareRealEstateChart();
        } else if (!this.errorMessage) {
          // If economicData is null and no parsing error was set
          this.errorMessage = 'Economic data is missing or invalid.';
        }
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = `Failed to load economic profile: ${err.message || 'Unknown error'}`;
        console.error(err);
        this.isLoading = false;
        this.profile = null;
        this.economicData = null;
      }
    });
  }

  prepareStockMarketChart(): void {
    if (this.economicData && this.economicData.stock_market && this.economicData.stock_market.points) {
      const stockData = this.economicData.stock_market;
      const labels = stockData.points.map((p: DataPoint) => p.date);
      const dataValues = stockData.points.map((p: DataPoint) => p.value);

      this.stockMarketChartData = {
        labels: labels,
        datasets: [
          {
            data: dataValues,
            label: stockData.name || 'Stock Value',
            borderColor: '#3e95cd',
            backgroundColor: 'rgba(62, 149, 205, 0.1)',
            fill: true,
            tension: 0.1
          }
        ]
      };
    } else {
      this.stockMarketChartData = { labels: [], datasets: [] }; // Clear or set to default
    }
  }

  prepareRealEstateChart(): void {
    if (this.economicData && this.economicData.real_estate && this.economicData.real_estate.price_trend) {
      const realEstateData = this.economicData.real_estate;
      const labels = realEstateData.price_trend.map((p: DataPoint) => p.date);
      const dataValues = realEstateData.price_trend.map((p: DataPoint) => p.value);

      this.realEstateChartData = {
        labels: labels,
        datasets: [
          {
            data: dataValues,
            label: 'Average Price Trend (USD/sqm)',
            borderColor: '#8e5ea2',
            backgroundColor: 'rgba(142, 94, 162, 0.1)',
            fill: true,
            tension: 0.1
          }
        ]
      };
    } else {
       this.realEstateChartData = { labels: [], datasets: [] }; // Clear or set to default
    }
  }
}
