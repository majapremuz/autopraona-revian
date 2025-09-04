import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CijenikPage } from './cijenik.page';

const routes: Routes = [
  {
    path: '',
    component: CijenikPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CijenikPageRoutingModule {}
