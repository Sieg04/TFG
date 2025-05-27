import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IndicatorValuesRoutingModule } from './indicator-values-routing.module';
// NgChartsModule is removed as IndicatorChartComponent is standalone and imports BaseChartDirective

// IndicatorValueListComponent is standalone and routed via IndicatorValuesRoutingModule.
// It imports ReactiveFormsModule and IndicatorChartComponent directly.
// This module only needs to import common Angular modules and its own routing.

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule, // Keep if other non-standalone components in this module use it
    IndicatorValuesRoutingModule
    // NgChartsModule removed
  ]
})
export class IndicatorValuesModule { }
