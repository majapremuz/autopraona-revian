import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderChemicalPage } from './order-chemical.page';

const routes: Routes = [
  {
    path: '',
    component: OrderChemicalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderChemicalPageRoutingModule {}
