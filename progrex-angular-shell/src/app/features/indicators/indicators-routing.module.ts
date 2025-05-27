import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndicatorListComponent } from './indicator-list/indicator-list.component';

const routes: Routes = [
  {
    path: '',
    component: IndicatorListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndicatorsRoutingModule { }
