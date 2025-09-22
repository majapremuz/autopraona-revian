import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderChemicalPageRoutingModule } from './order-chemical-routing.module';

import { OrderChemicalPage } from './order-chemical.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderChemicalPageRoutingModule
  ],
  declarations: [OrderChemicalPage]
})
export class OrderChemicalPageModule {}
