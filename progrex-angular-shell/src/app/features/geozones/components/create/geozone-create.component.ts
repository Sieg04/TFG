import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GeoZoneService } from '../../../../core/services/geo-zone.service';
import { GeoZoneCreate } from '../../../../core/models/geo-zone.model';

@Component({
  selector: 'app-geozone-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>Create New GeoZone</h2>
      <form [formGroup]="geoZoneForm" (ngSubmit)="onSubmit()">
        <div class="form-field">
          <label for="name">Name:</label>
          <input id="name" formControlName="name" placeholder="GeoZone Name">
          <div *ngIf="geoZoneForm.get('name')?.invalid && (geoZoneForm.get('name')?.dirty || geoZoneForm.get('name')?.touched)" class="error-message">
            Name is required.
          </div>
        </div>

        <div class="form-field">
          <label for="description">Description:</label>
          <textarea id="description" formControlName="description" placeholder="Optional description"></textarea>
        </div>

        <div class="form-field">
          <label for="geojson_data">GeoJSON Data:</label>
          <textarea id="geojson_data" formControlName="geojson_data" rows="10" placeholder="Paste GeoJSON here"></textarea>
          <div *ngIf="geoZoneForm.get('geojson_data')?.invalid && (geoZoneForm.get('geojson_data')?.dirty || geoZoneForm.get('geojson_data')?.touched)" class="error-message">
            GeoJSON data is required.
          </div>
        </div>

        <button type="submit" [disabled]="geoZoneForm.invalid || isLoading">
          {{ isLoading ? 'Creating...' : 'Create GeoZone' }}
        </button>
      </form>
      <div *ngIf="isLoading" class="loading-message">Creating GeoZone...</div>
      <div *ngIf="successMessage" class="success-message">{{ successMessage }}</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  `,
  styles: [``] // Consider adding some basic form styling later
})
export class GeoZoneCreateComponent {
  geoZoneForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private geoZoneService: GeoZoneService,
    private router: Router
  ) {
    this.geoZoneForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      // Storing GeoJSON as a string, backend will parse if needed
      geojson_data: ['', Validators.required] 
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.geoZoneForm.valid) {
      const formValue = this.geoZoneForm.value;
      const geoZoneData: GeoZoneCreate = {
        name: formValue.name,
        description: formValue.description,
        // Pass geojson_data as a string. If backend expects dict, it should parse.
        // The Pydantic model `geojson_data: Any` on the backend might handle this,
        // or the CRUD operation might need `json.loads(formValue.geojson_data)`.
        // For now, sending as string as per the form value.
        geojson_data: formValue.geojson_data, 
        // user_id is optional in GeoZoneCreate and will not be set here.
        // Backend will handle assignment or leave it null.
      };

      this.geoZoneService.createGeoZone(geoZoneData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = `GeoZone "${response.name}" created successfully! ID: ${response.id}`;
          console.log('[GeoZoneCreateComponent] GeoZone created:', response);
          this.geoZoneForm.reset();
          // Optional: Navigate after a short delay or user action
          // For now, just reset and show message.
          // Example navigation:
          // setTimeout(() => this.router.navigate(['/admin/geozones']), 2000); 
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.detail || 'Failed to create GeoZone. Please try again.';
          console.error('[GeoZoneCreateComponent] Error creating GeoZone:', err);
        }
      });
    } else {
      this.isLoading = false;
      this.errorMessage = 'Form is invalid. Please check the fields.';
      console.log('[GeoZoneCreateComponent] Form is invalid. Marking all as touched.');
      this.geoZoneForm.markAllAsTouched(); // To trigger validation messages
    }
  }
}