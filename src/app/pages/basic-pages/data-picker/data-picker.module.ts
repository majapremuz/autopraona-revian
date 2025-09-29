import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataPickerPageRoutingModule } from './data-picker-routing.module';

import { DataPickerPage } from './data-picker.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataPickerPageRoutingModule,
    TranslateModule,
    ComponentsModule
  ],
  declarations: [DataPickerPage]
})
export class DataPickerPageModule {}
