import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IndicatorValuesRoutingModule } from './indicator-values-routing.module';
import { NgChartsModule } from 'ng2-charts'; // Import NgChartsModule

// IndicatorValueListComponent is standalone and routed via IndicatorValuesRoutingModule.
// It imports ReactiveFormsModule directly.
// This module imports ReactiveFormsModule and NgChartsModule to be available for any potential non-standalone components
// or if IndicatorChartComponent was not standalone and declared here.

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IndicatorValuesRoutingModule,
    NgChartsModule // Add NgChartsModule here
  ]
})
export class IndicatorValuesModule { }
