import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GeoZoneService } from '../../../../core/services/geo-zone.service';
import { GeoZone } from '../../../../core/models/geo-zone.model';

@Component({
  selector: 'app-geozone-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './geozone-list.component.html',
  styleUrls: ['./geozone-list.component.css']
})
export class GeoZoneListComponent implements OnInit {
  public geoZones: GeoZone[] = [];
  public isLoading: boolean = true;
  public errorMessage: string | null = null;

  constructor(private geoZoneService: GeoZoneService) {}

  ngOnInit(): void {
    this.loadGeoZones();
  }

  loadGeoZones(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.geoZoneService.getGeoZones().subscribe({
      next: (data) => {
        this.geoZones = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching geozones:', err);
        this.errorMessage = 'Failed to load GeoZones. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  deleteGeoZone(geoZoneId: number): void {
    if (confirm(`Are you sure you want to delete GeoZone with ID: ${geoZoneId}?`)) {
      this.isLoading = true; // Optional: disable UI while deleting
      this.geoZoneService.deleteGeoZone(geoZoneId).subscribe({
        next: () => {
          this.loadGeoZones(); // Refresh list after delete
          // Optionally, show a success message (e.g., using a toast service)
        },
        error: (err) => {
          console.error(`Error deleting GeoZone ${geoZoneId}:`, err);
          this.errorMessage = `Failed to delete GeoZone ${geoZoneId}. Error: ${err.message || 'Unknown error'}`;
          this.isLoading = false; // Re-enable UI if delete fails
        }
      });
    }
  }
}
