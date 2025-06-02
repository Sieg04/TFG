import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicatorsRoutingModule } from './indicators-routing.module';

// IndicatorListComponent is standalone and routed via IndicatorsRoutingModule.
// No need to declare or import it here.

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IndicatorsRoutingModule
  ]
})
export class IndicatorsModule { }
