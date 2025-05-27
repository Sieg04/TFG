import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { IndicatorValue } from '../../../core/models/indicator-value.model';

@Component({
  selector: 'app-indicator-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './indicator-chart.component.html',
  styleUrls: ['./indicator-chart.component.css']
})
export class IndicatorChartComponent implements OnChanges {
  @Input() indicatorValues: IndicatorValue[] = [];
  @Input() indicatorName: string = 'Indicator Trend'; // Default name, can be overridden

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public lineChartType: ChartType = 'line';
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time', // Use time scale for dates
        time: {
          unit: 'year', // Adjust based on data granularity (day, month, year)
          tooltipFormat: 'MMM yyyy', // e.g., Jan 2023
          displayFormats: {
             year: 'yyyy'
          }
        },
        title: {
          display: true,
          text: 'Date'
        },
        ticks: {
          color: '#34495e' // var(--text-color)
        },
        grid: {
          color: '#bdc3c7' // var(--border-color)
        }
      },
      y: {
        title: {
          display: true,
          text: 'Value'
        },
        ticks: {
          color: '#34495e' // var(--text-color)
        },
        grid: {
          color: '#bdc3c7' // var(--border-color)
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#34495e' // var(--text-color)
        }
      },
      tooltip: {
        backgroundColor: 'rgba(44, 62, 80, 0.8)', // var(--primary-color) with alpha
        titleColor: '#ffffff', // var(--light-text-color)
        bodyColor: '#ecf0f1' // var(--background-color)
      }
    }
  };

  public lineChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: this.indicatorName,
        fill: true,
        tension: 0.4, // Smoother lines
        borderColor: '#3498db', // var(--secondary-color)
        backgroundColor: 'rgba(52, 152, 219, 0.2)', // var(--secondary-color) with alpha
        pointBackgroundColor: '#3498db',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3498db'
      }
    ]
  };

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['indicatorValues'] && this.indicatorValues) {
      this.updateChartData();
    }
    if (changes['indicatorName']) {
        this.lineChartData.datasets[0].label = this.indicatorName;
        this.chart?.update();
    }
  }

  private updateChartData(): void {
    if (!this.indicatorValues || this.indicatorValues.length === 0) {
      this.lineChartData.labels = [];
      this.lineChartData.datasets[0].data = [];
      this.chart?.update();
      return;
    }

    // Sort values by date if not already sorted
    const sortedValues = [...this.indicatorValues].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    this.lineChartData.labels = sortedValues.map(value => new Date(value.date)); // Use Date objects for time scale
    this.lineChartData.datasets[0].data = sortedValues.map(value => value.value);
    this.lineChartData.datasets[0].label = this.indicatorName || 'Indicator Trend';

    this.chart?.update(); // Trigger chart update
  }
}
