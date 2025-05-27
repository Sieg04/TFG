import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesRoutingModule } from './countries-routing.module';

// CountryListComponent is standalone and routed via CountriesRoutingModule.
// No need to declare or import it here.

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CountriesRoutingModule
  ]
})
export class CountriesModule { }
