// progrex-angular-shell/src/app/features/economic-profile/economic-profile.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// CommonModule and NgChartsModule are no longer needed here as the component is standalone
// import { CommonModule } from '@angular/common';
// import { NgChartsModule } from 'ng2-charts';

import { CountryEconomicProfileComponent } from './country-economic-profile.component';

const routes: Routes = [
  { path: ':countryId', component: CountryEconomicProfileComponent }
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
