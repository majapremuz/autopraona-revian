import { NgModule } from "@angular/core";

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { InfoComponent } from "./info/info.component";
import { InputDataComponent } from "./input-data/input-data.component";
import { InputDateComponent } from "./input-date/input-date.component";


@NgModule({
    imports: [IonicModule, CommonModule],
    declarations: [InfoComponent,InputDataComponent,InputDateComponent],
    exports: [InfoComponent,InputDataComponent,InputDateComponent]
})
export class ComponentsModule{}