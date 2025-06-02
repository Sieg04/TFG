import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router'; // RouterModule for potential links
import { UserService } from '../../../../core/services/user.service';
import { GeoZoneService } from '../../../../core/services/geo-zone.service';
import { User } from '../../../../core/models/user.model';
import { GeoZone } from '../../../../core/models/geo-zone.model';
import { switchMap } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs'; // Import of for handling empty geozones

interface UserDetailData {
  user: User;
  assignedGeoZones: GeoZone[];
}

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  public userDetailData$: Observable<UserDetailData | null> = of(null); // Initialize with null
  public isLoading: boolean = true;
  public errorMessage: string | null = null;
  private userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private geoZoneService: GeoZoneService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.params.pipe(
      switchMap(params => {
        const id = params['id'];
        if (!id) {
          this.errorMessage = 'User ID not found in route.';
          this.isLoading = false;
          return of(null); // Return an observable of null
        }
        this.userId = +id; // Convert string 'id' to a number

        const user$ = this.userService.getUser(this.userId);
        const allGeoZones$ = this.geoZoneService.getGeoZones(); // Fetch all geozones

        return forkJoin({ user: user$, allGeoZones: allGeoZones$ });
      })
    ).subscribe({
      next: (result) => {
        if (result && this.userId !== null) {
          const { user, allGeoZones } = result;
          const assignedGeoZones = allGeoZones.filter(zone => zone.user_id === this.userId);
          this.userDetailData$ = of({ user, assignedGeoZones }); // Wrap in of() to make it an Observable
        } else if(!result) {
          // Error message already set if userId was missing
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching user details or geozones:', err);
        this.errorMessage = 'Failed to load user details. Please try again later.';
        this.isLoading = false;
        this.userDetailData$ = of(null); // Ensure it's an observable of null on error
      }
    });
  }
}
