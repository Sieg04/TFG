import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard'; // Import adminGuard
import { SettingsComponent } from './features/dashboard/settings/settings.component';
import { OverviewComponent } from './features/dashboard/overview/overview.component';
import { GeoZoneCreateComponent } from './features/geozones/components/create/geozone-create.component';
import { ManageIndicatorsComponent } from './features/indicators/components/manage/manage-indicators.component';
import { UserProfileComponent } from './features/user/profile/user-profile.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard/settings', // The URL path
    component: SettingsComponent,    // The component to load
    canActivate: [authGuard]       // Protect with authGuard, similar to dashboard
  },
  {
    path: 'dashboard/overview',    // The URL path
    component: OverviewComponent,  // The component to load
    canActivate: [authGuard]     // Protect with authGuard, similar to other dashboard routes
  },
  {
    path: '',
    redirectTo: '/dashboard', // Redirect default path to dashboard
    pathMatch: 'full'
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuard, adminGuard] // Protect with both guards
  },
  {
    path: 'countries',
    loadChildren: () => import('./features/countries/countries.module').then(m => m.CountriesModule),
    canActivate: [authGuard]
  },
  {
    path: 'indicators',
    loadChildren: () => import('./features/indicators/indicators.module').then(m => m.IndicatorsModule),
    canActivate: [authGuard]
  },
  {
    path: 'datasources', // Route path for data sources
    loadChildren: () => import('./features/data-sources/data-sources.module').then(m => m.DataSourcesModule),
    canActivate: [authGuard]
  },
  {
    path: 'indicatorvalues', // Route path for indicator values
    loadChildren: () => import('./features/indicator-values/indicator-values.module').then(m => m.IndicatorValuesModule),
    canActivate: [authGuard]
  },
  {
    path: 'geozones/create',
    component: GeoZoneCreateComponent,
    canActivate: [authGuard]
  },
  {
    path: 'indicators/manage',
    component: ManageIndicatorsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'user/profile',
    component: UserProfileComponent,
    canActivate: [authGuard]
  }
  // Catch-all or 404 route can be added here if needed
  // { path: '**', component: PageNotFoundComponent }
];
