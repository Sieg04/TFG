import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataSourceListComponent } from './data-source-list/data-source-list.component';

const routes: Routes = [
  {
    path: '',
    component: DataSourceListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataSourcesRoutingModule { }
