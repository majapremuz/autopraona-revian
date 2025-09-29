import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDataPageRoutingModule } from './edit-data-routing.module';

import { EditDataPage } from './edit-data.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditDataPageRoutingModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [EditDataPage]
})
export class EditDataPageModule {}
