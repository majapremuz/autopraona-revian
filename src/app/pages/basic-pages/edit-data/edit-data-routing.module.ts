import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDataPage } from './edit-data.page';

const routes: Routes = [
  {
    path: '',
    component: EditDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDataPageRoutingModule {}
