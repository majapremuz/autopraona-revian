import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPasswordPageRoutingModule } from './edit-password-routing.module';

import { EditPasswordPage } from './edit-password.page';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPasswordPageRoutingModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [EditPasswordPage]
})
export class EditPasswordPageModule {}
