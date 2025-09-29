import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PriceListPageRoutingModule } from './price-list-routing.module';

import { PriceListPage } from './price-list.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PriceListPageRoutingModule,
    TranslateModule
  ],
  declarations: [PriceListPage]
})
export class PriceListPageModule {}
