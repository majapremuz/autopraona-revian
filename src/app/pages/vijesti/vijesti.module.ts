import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VijestiPageRoutingModule } from './vijesti-routing.module';

import { VijestiPage } from './vijesti.page';

@NgModule({
  imports: [
    VijestiPage,
    CommonModule,
    FormsModule,
    IonicModule,
    VijestiPageRoutingModule
  ],
  declarations: []
})
export class VijestiPageModule {}
