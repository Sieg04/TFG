import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule

import { AuthRoutingModule } from './auth-routing.module';
// LoginComponent and RegisterComponent are standalone and do not need to be declared here.

@NgModule({
  imports: [
    CommonModule, // Good to have for any non-standalone components or directives in this module
    ReactiveFormsModule, // Good to have for any non-standalone components using forms
    AuthRoutingModule
  ]
  // No declarations or exports needed for standalone components referenced by routing.
})
export class AuthModule { }
