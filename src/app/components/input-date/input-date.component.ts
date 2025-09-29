import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControllerService } from 'src/app/services/controller.service';

@Component({
  selector: 'app-input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => InputDateComponent)
  }],
  standalone: false
})
export class InputDateComponent  implements OnInit, ControlValueAccessor {

  @Input() time!: string;

  value = 0;
  disabled = false;
  text: string = '';

  placeholder: string = '';

  onChange = (value: any) => {};
  onTouched = () => {};

  constructor(
    public dataCtrl: ControllerService
  ) { 
  }

 async  ngOnInit() {
    if(this.time == 'time'){
      this.placeholder = await this.dataCtrl.translateWord("OTHER.SELECT_TIME");
    }else{
      this.placeholder = await this.dataCtrl.translateWord("OTHER.SELECT_DATE");
    }
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

}
