import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KontaktPageRoutingModule } from './kontakt-routing.module';

import { KontaktPage } from './kontakt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KontaktPageRoutingModule
  ],
  declarations: [KontaktPage]
})
export class KontaktPageModule {}
