import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSourcesRoutingModule } from './data-sources-routing.module';

// DataSourceListComponent is standalone and routed via DataSourcesRoutingModule.
// No need to declare or import it here.

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DataSourcesRoutingModule
  ]
})
export class DataSourcesModule { }
