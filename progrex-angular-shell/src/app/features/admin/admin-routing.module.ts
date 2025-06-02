import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { GeoZoneListComponent } from './geozones/geozone-list/geozone-list.component'; // Import GeoZoneListComponent
import { GeoZoneFormComponent } from './geozones/geozone-form/geozone-form.component'; // Import GeoZoneFormComponent

const routes: Routes = [
  {
    path: 'users',
    component: UserListComponent
  },
  {
    path: 'users/:id',
    component: UserDetailComponent
  },
  {
    path: 'geozones',
    component: GeoZoneListComponent
  },
  {
    path: 'geozones/new',
    component: GeoZoneFormComponent
  },
  {
    path: 'geozones/edit/:id',
    component: GeoZoneFormComponent
  },
  {
    path: '',
    redirectTo: 'users', // Default admin path still redirects to user list for now
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
