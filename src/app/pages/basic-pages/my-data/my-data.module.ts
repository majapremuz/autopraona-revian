import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyDataPageRoutingModule } from './my-data-routing.module';

import { MyDataPage } from './my-data.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyDataPageRoutingModule,
    TranslateModule,
    ComponentsModule
  ],
  declarations: [MyDataPage]
})
export class MyDataPageModule {}
