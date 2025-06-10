import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts'; // Import BaseChartDirective

import { UruguayDashboardRoutingModule } from './uruguay-dashboard-routing.module';
import { UruguayDashboardPageComponent } from './pages/uruguay-dashboard-page/uruguay-dashboard-page.component';
// HttpClientModule is not needed here if provideHttpClient is used in app.config.ts


@NgModule({
  declarations: [
    // UruguayDashboardPageComponent is now standalone
  ],
  imports: [
    CommonModule,
    UruguayDashboardRoutingModule,
    // BaseChartDirective is imported by UruguayDashboardPageComponent directly
    UruguayDashboardPageComponent // Import the standalone component
  ]
})
export class UruguayDashboardModule { }
