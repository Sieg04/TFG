import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndicatorValueListComponent } from './indicator-value-list/indicator-value-list.component';

const routes: Routes = [
  {
    path: '',
    component: IndicatorValueListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndicatorValuesRoutingModule { }
