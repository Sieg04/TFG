import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // For potential future links
import { DataSourceService } from '../../../core/services/data-source.service';
import { DataSource } from '../../../core/models/data-source.model';

@Component({
  selector: 'app-data-source-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './data-source-list.component.html',
  styleUrls: ['./data-source-list.component.css']
})
export class DataSourceListComponent implements OnInit {
  public dataSources: DataSource[] = [];
  public isLoading: boolean = true;
  public errorMessage: string | null = null;

  constructor(private dataSourceService: DataSourceService) {}

  ngOnInit(): void {
    this.loadDataSources();
  }

  loadDataSources(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.dataSourceService.getDataSources().subscribe({
      next: (data) => {
        this.dataSources = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching data sources:', err);
        this.errorMessage = 'Failed to load data sources. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
