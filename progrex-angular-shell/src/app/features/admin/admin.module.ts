import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';

// UserListComponent is standalone and routed via AdminRoutingModule,
// so it does not need to be declared or imported directly into this module's `declarations` or `imports` array
// unless it was not standalone or used directly in a template of a component declared in this module.

@NgModule({
  declarations: [
    // No declarations needed if all components are standalone and routed.
  ],
  imports: [
    CommonModule,
    AdminRoutingModule // Imports routes which point to standalone components
  ]
})
export class AdminModule { }
