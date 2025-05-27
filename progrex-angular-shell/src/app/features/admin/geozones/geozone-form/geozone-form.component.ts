import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GeoZoneService } from '../../../../core/services/geo-zone.service';
import { UserService } from '../../../../core/services/user.service'; // Import UserService
import { GeoZone, GeoZoneCreate } from '../../../../core/models/geo-zone.model';
import { User } from '../../../../core/models/user.model'; // Import User model
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-geozone-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './geozone-form.component.html',
  styleUrls: ['./geozone-form.component.css']
})
export class GeoZoneFormComponent implements OnInit {
  geoZoneForm: FormGroup;
  isEditMode: boolean = false;
  geoZoneId: number | null = null;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  users: User[] = []; // To store list of users for dropdown

  constructor(
    private fb: FormBuilder,
    private geoZoneService: GeoZoneService,
    private userService: UserService, // Inject UserService
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.geoZoneForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      user_id: [null], // Can be null or a number
      geojson_data: ['', [Validators.required, this.jsonValidator]]
    });
  }

  ngOnInit(): void {
    this.loadUsers(); // Load users for the dropdown

    this.route.params.pipe(
      switchMap(params => {
        this.geoZoneId = params['id'] ? +params['id'] : null;
        if (this.geoZoneId) {
          this.isEditMode = true;
          return this.geoZoneService.getGeoZone(this.geoZoneId);
        }
        return of(null); // Create mode
      })
    ).subscribe({
      next: (geoZone) => {
        if (this.isEditMode && geoZone) {
          this.geoZoneForm.patchValue({
            ...geoZone,
            geojson_data: JSON.stringify(geoZone.geojson_data, null, 2), // Pretty print JSON
            user_id: geoZone.user_id === undefined ? null : geoZone.user_id // Handle undefined user_id
          });
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading GeoZone:', err);
        this.errorMessage = 'Failed to load GeoZone data.';
        this.isLoading = false;
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: (err) => {
        console.error('Failed to load users for dropdown:', err);
        this.errorMessage = 'Failed to load users list.';
      }
    });
  }

  jsonValidator(control: any) {
    try {
      JSON.parse(control.value);
      return null; // Valid JSON
    } catch (e) {
      return { jsonInvalid: true }; // Invalid JSON
    }
  }

  onFileChange(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const fileContent = reader.result as string;
          JSON.parse(fileContent); // Validate JSON
          this.geoZoneForm.get('geojson_data')?.setValue(fileContent);
          this.geoZoneForm.get('geojson_data')?.markAsDirty();
          this.geoZoneForm.get('geojson_data')?.updateValueAndValidity();
          this.successMessage = 'GeoJSON file loaded successfully.';
          this.errorMessage = null;
        } catch (err) {
          this.geoZoneForm.get('geojson_data')?.setErrors({ jsonInvalid: true });
          this.errorMessage = 'Invalid GeoJSON file format.';
          this.successMessage = null;
        }
      };
      reader.onerror = (e) => {
        this.errorMessage = 'Error reading file.';
        this.successMessage = null;
      }
      reader.readAsText(file);
    }
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.geoZoneForm.invalid) {
      this.geoZoneForm.markAllAsTouched();
      this.errorMessage = 'Please correct the errors in the form.';
      return;
    }

    this.isLoading = true;
    let geoJsonDataParsed;
    try {
      geoJsonDataParsed = JSON.parse(this.geoZoneForm.get('geojson_data')?.value);
    } catch (e) {
      this.geoZoneForm.get('geojson_data')?.setErrors({ jsonInvalid: true });
      this.errorMessage = 'GeoJSON data is not valid JSON.';
      this.isLoading = false;
      return;
    }

    const formData: GeoZoneCreate = {
      name: this.geoZoneForm.get('name')?.value,
      description: this.geoZoneForm.get('description')?.value || undefined,
      user_id: this.geoZoneForm.get('user_id')?.value === 'null' ? null : Number(this.geoZoneForm.get('user_id')?.value) || null, // Ensure user_id is number or null
      geojson_data: geoJsonDataParsed
    };
    
    // Ensure user_id is null if not selected, not 0 or NaN
    if (formData.user_id === 0 || isNaN(formData.user_id!)) {
        formData.user_id = null;
    }


    const operation = this.isEditMode && this.geoZoneId
      ? this.geoZoneService.updateGeoZone(this.geoZoneId, formData)
      : this.geoZoneService.createGeoZone(formData);

    operation.subscribe({
      next: () => {
        this.successMessage = `GeoZone ${this.isEditMode ? 'updated' : 'created'} successfully.`;
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/admin/geozones']), 1500); // Navigate after delay
      },
      error: (err) => {
        console.error(`Error ${this.isEditMode ? 'updating' : 'creating'} GeoZone:`, err);
        this.errorMessage = `Failed to ${this.isEditMode ? 'update' : 'create'} GeoZone. ${err.error?.detail || err.message || 'Please check your input.'}`;
        this.isLoading = false;
      }
    });
  }
}
