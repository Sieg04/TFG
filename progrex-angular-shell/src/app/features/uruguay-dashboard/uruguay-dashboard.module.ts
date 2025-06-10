import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts'; // Import NgChartsModule

import { UruguayDashboardRoutingModule } from './uruguay-dashboard-routing.module';
import { UruguayDashboardPageComponent } from './pages/uruguay-dashboard-page/uruguay-dashboard-page.component';
// HttpClientModule is not needed here if provideHttpClient is used in app.config.ts


@NgModule({
  declarations: [
    UruguayDashboardPageComponent // Declare the component
  ],
  imports: [
    CommonModule,
    UruguayDashboardRoutingModule,
    NgChartsModule // Add NgChartsModule here
  ]
})
export class UruguayDashboardModule { }
