// progrex-angular-shell/src/app/features/economic-profile/economic-profile.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// CommonModule and NgChartsModule are no longer needed here as the component is standalone
// import { CommonModule } from '@angular/common';
// import { NgChartsModule } from 'ng2-charts';

import { CountryEconomicProfileComponent } from './country-economic-profile.component';

const routes: Routes = [
  { path: ':countryId', component: CountryEconomicProfileComponent }
  // For fully lazy-loading a standalone component directly in newer Angular versions,
  // the route might look like:
  // { 
  //   path: ':countryId', 
  //   loadComponent: () => import('./country-economic-profile.component').then(m => m.CountryEconomicProfileComponent) 
  // }
  // But the current structure is a feature module lazy-loaded, which then eagerly loads its routed components.
  // Since CountryEconomicProfileComponent is standalone, it's not declared.
];

@NgModule({
  declarations: [
    // CountryEconomicProfileComponent is standalone, so not declared here.
  ],
  imports: [
    // CommonModule, // Not needed here
    RouterModule.forChild(routes),
    // NgChartsModule // Not needed here
  ],
  exports: [RouterModule]
})
export class EconomicProfileModule { }
