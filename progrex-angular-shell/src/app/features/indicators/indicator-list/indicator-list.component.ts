import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // For potential future links
import { IndicatorService } from '../../../core/services/indicator.service';
import { Indicator } from '../../../core/models/indicator.model';

@Component({
  selector: 'app-indicator-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './indicator-list.component.html',
  styleUrls: ['./indicator-list.component.css']
})
export class IndicatorListComponent implements OnInit {
  public indicators: Indicator[] = [];
  public isLoading: boolean = true;
  public errorMessage: string | null = null;

  constructor(private indicatorService: IndicatorService) {}

  ngOnInit(): void {
    this.loadIndicators();
  }

  loadIndicators(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.indicatorService.getIndicators().subscribe({
      next: (data) => {
        this.indicators = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching indicators:', err);
        this.errorMessage = 'Failed to load indicators. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
