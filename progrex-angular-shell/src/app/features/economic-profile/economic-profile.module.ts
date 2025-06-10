// progrex-angular-shell/src/app/features/economic-profile/economic-profile.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';

import { CountryEconomicProfileComponent } from './country-economic-profile.component';

const routes: Routes = [
  { path: ':countryId', component: CountryEconomicProfileComponent }
];

@NgModule({
  declarations: [
    CountryEconomicProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgChartsModule
  ],
  exports: [RouterModule] // Export RouterModule if this module's routes are to be used by a parent routing module directly
})
export class EconomicProfileModule { }
