import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DateRezervedPageRoutingModule } from './date-rezerved-routing.module';

import { DateRezervedPage } from './date-rezerved.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DateRezervedPageRoutingModule
  ],
  declarations: [DateRezervedPage]
})
export class DateRezervedPageModule {}
