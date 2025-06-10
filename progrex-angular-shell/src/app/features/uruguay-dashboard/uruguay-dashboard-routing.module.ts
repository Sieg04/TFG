import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UruguayDashboardPageComponent } from './pages/uruguay-dashboard-page/uruguay-dashboard-page.component';

const routes: Routes = [
  {
    path: '',
    component: UruguayDashboardPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UruguayDashboardRoutingModule { }
