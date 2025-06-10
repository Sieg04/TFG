import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UruguayDashboardPageComponent } from './pages/uruguay-dashboard-page/uruguay-dashboard-page.component';

const routes: Routes = [
  {
    path: '',
    component: UruguayDashboardPageComponent
  }
];
export const routes: Routes = [
    {
        path: 'uruguay-dashboard',
        loadChildren: () => import('./features/uruguay-dashboard/uruguay-dashboard.module').then(m => m.UruguayDashboardModule)
    }
    // Potentially other app routes here
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UruguayDashboardRoutingModule { }
