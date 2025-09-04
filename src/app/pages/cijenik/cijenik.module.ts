import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CijenikPageRoutingModule } from './cijenik-routing.module';

import { CijenikPage } from './cijenik.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CijenikPageRoutingModule
  ],
  declarations: [CijenikPage]
})
export class CijenikPageModule {}
