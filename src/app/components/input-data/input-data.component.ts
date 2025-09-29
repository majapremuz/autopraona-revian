import { Component, EventEmitter, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControllerService } from 'src/app/services/controller.service';

@Component({
  selector: 'app-input-data',
  templateUrl: './input-data.component.html',
  styleUrls: ['./input-data.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => InputDataComponent)
  }],
  standalone: false
})
export class InputDataComponent  implements ControlValueAccessor {

  value = 0;
  disabled = false;
  text: string = '';
  placeholder: string = '';

  onChange = (value: any) => {};
  onTouched = () => {};

  @Output() openItem = new EventEmitter()
  @Output() addItem = new EventEmitter()


  constructor(
    public dataCtrl: ControllerService
  ) { 
    this.translate();
  }

  async translate(){
    this.placeholder = await this.dataCtrl.translateWord("OTHER.SELECT");
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: any): void {
    this.value = value.value;
    this.text = value.text;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  addButtonClick(){
    this.addItem.emit();
  }

  itemClick(){
    this.openItem.emit();
  }

}
