import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DateRezervedPage } from './date-rezerved.page';

const routes: Routes = [
  {
    path: '',
    component: DateRezervedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DateRezervedPageRoutingModule {}
