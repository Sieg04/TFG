import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard'; // Import adminGuard

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
  // Catch-all or 404 route can be added here if needed
  // { path: '**', component: PageNotFoundComponent }
];
