import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AlertType, ControllerService } from 'src/app/services/controller.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.page.html',
  styleUrls: ['./reservation.page.scss'],
  standalone: false
})
export class ReservationPage implements OnInit {

  back_button_string: string = '/tabs/orders';

  reservation_data: {
    object_id: number,
    object_name: string,
    interval_id: number,
    interval_name: string,
    date: string,
    date_display: string,
    period: string,
    inqury: boolean
  } | null = null;

  data_load: boolean = false;

  form?: FormGroup;
  form_load: boolean = false;

  page_title: string = '';
  button_title: string = '';


  constructor(
    private fb: FormBuilder,
    private apiCtrl: ControllerService,
    private navCtrl: NavController 
  ) { }

  async ngOnInit() {
    let data_str = await this.apiCtrl.getStorage('reservation_data');
    this.page_title = await this.apiCtrl.translateWord('RESERVATION_PERIOD.TITLE');
    this.button_title = await this.apiCtrl.translateWord('RESERVATION_PERIOD.RESERVE_BUTTON');


    if(data_str != null){
      this.reservation_data = JSON.parse(data_str);

      if(this.reservation_data?.inqury == true){
        this.page_title = await this.apiCtrl.translateWord('RESERVATION_PERIOD.INQURY');
        this.button_title = await this.apiCtrl.translateWord('RESERVATION_PERIOD.INQURY_BUTTON');
      }
      this.data_load = true;
    }

    let name: string = '';
    let surname: string = '';
    let car_model: string = '';
    let car_plate: string = '';

    let user_data_str = await this.apiCtrl.getStorage('user_data');
    if(user_data_str != null){
      let user_data = JSON.parse(user_data_str);
      name = user_data?.user_name || '';
      surname = user_data?.user_surname || '';
      car_model = user_data?.car_model || '';
      car_plate = user_data?.car_plate || '';
    }else{
      if(this.apiCtrl.isLogin() == true){
        name = this.apiCtrl.user?.user_firstname || '';
        surname = this.apiCtrl.user?.user_lastname || '';
      }
    }

    this.form = this.fb.group({
      name: [name, [Validators.required]],
      surname: [surname, [Validators.required]],
      car_model: [car_model, [Validators.required]],
      car_plate: [car_plate, [Validators.required]]
    });

    this.form_load = true;
  }

  cancel(){
    this.navCtrl.back();
  }

  async clickReserve(){
    let url: string = '';

    let additional_data = {
      user_name: this.form?.value.name,
      user_surname: this.form?.value.surname,
      car_model: this.form?.value.car_model,
      car_plate: this.form?.value.car_plate
    };

    let send_data = {
      date: '',
      period: this.reservation_data?.period,
      interval: this.reservation_data?.interval_id,
      object: this.reservation_data?.object_id,
      name: this.reservation_data?.object_name + ' - ' + this.reservation_data?.period,
      description: '',
      user_name: this.form?.value.name,
      user_surname: this.form?.value.surname,
      car_model: this.form?.value.car_model,
      car_plate: this.form?.value.car_plate,
      additional_data: additional_data
    };

    if(this.reservation_data?.inqury == true){
      // send inqury
      url = '/api/reservation/inqury';
      send_data.date = this.reservation_data?.date;
    }else{
      // send reservation
      url = '/api/reservation/reservation';
      send_data.date = this.reservation_data?.date + 'T' + this.reservation_data?.period + ':00';
    }

    let save_data = {
      user_name: this.form?.value.name,
      user_surname: this.form?.value.surname,
      car_model: this.form?.value.car_model,
      car_plate: this.form?.value.car_plate
    };

    await this.apiCtrl.setStorage('user_data', JSON.stringify(save_data));

    let response = await this.apiCtrl.postServer(url, send_data).catch(err => {
      return undefined;
    });

    if(response != undefined && response?.['message'] == 'success'){
      let message = await this.apiCtrl.translateWord('MESSAGES.SUCCESS');
      this.apiCtrl.showToast(message, AlertType.Success);
      this.navCtrl.back();
    }else{
      let message = await this.apiCtrl.translateWord('MESSAGES.SERVER_ERROR');
      this.apiCtrl.showToast(message, AlertType.Warning);
    }
  }

}
