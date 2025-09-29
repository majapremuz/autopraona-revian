import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { UserObject } from 'src/app/model/user';
import { AlertType, ControllerService } from 'src/app/services/controller.service';
import { get_country_code_from_number, get_valid_number, phone_validator } from 'src/app/validators/validators';

@Component({
  selector: 'app-edit-data',
  templateUrl: './edit-data.page.html',
  styleUrls: ['./edit-data.page.scss'],
  standalone: false
})
export class EditDataPage implements OnInit {

  form_edit_user: FormGroup;

  constructor(
    private dataCtrl: ControllerService,
    private fb: FormBuilder,
    private navCtrl: NavController
  ) {

    let first_name = this.dataCtrl.user?.user_firstname || '';
    let last_name = this.dataCtrl.user?.user_lastname || '';
    let city = this.dataCtrl.user?.user_city || '';
    let address = this.dataCtrl.user?.user_address || '';
    let user_phone = this.dataCtrl.user?.user_phone || '';
    let phone: string = '';
    let phone_code: string = '';

    if(user_phone == ''){
      phone = '';
      phone_code = '+385'; //default country_code
    }
    else{
      try{
        let phone_obj = get_country_code_from_number(user_phone);
        phone = phone_obj.number;
        phone_code = '+' + phone_obj.national_number; 
      }
      catch{
        phone = '';
        phone_code = '+385'; //default country_code
      }
    }

    this.form_edit_user = this.fb.group({
      first_name: [first_name, [Validators.required]],
      last_name: [last_name, [Validators.required]],
      phone_code: [phone_code,[phone_validator]],
      phone: [phone, [Validators.required,phone_validator]],
      user_city: [ city,[]],
      user_address: [ address,[]]
    });
  }

  ngOnInit() {
    //
  }

  async editUser(){

      let send_data = {
        user_id: this.dataCtrl.user?.user_id,
        user_phone: get_valid_number(this.form_edit_user.value.phone_code, this.form_edit_user.value.phone),
        user_firstname: this.form_edit_user.value.first_name,
        user_lastname: this.form_edit_user.value.last_name,
        user_city: this.form_edit_user.value.user_city,
        user_zip: this.form_edit_user.value.user_zip,
        user_address: this.form_edit_user.value.user_address
      };

      await this.dataCtrl.showLoader();

      let request = await this.dataCtrl.putServer('/api/user/user', send_data).catch(err => {
        this.dataCtrl.parseErrorMessage(err).then(message => {
          this.dataCtrl.showToast(message.message, message.type);
            if(message.title == 'server_error'){
              // take some action e.g logout, change page
            }
        });
        return undefined;
      });

      if(request != undefined){
        let message = await this.dataCtrl.translateWord("MESSAGES.SUCCESS");
        this.dataCtrl.showToast(message, AlertType.Success);
        let userData = await this.dataCtrl.getUserData().catch(err => {
          return undefined;
        });

        if(userData != undefined){
          this.dataCtrl.user = new UserObject(userData['data']);
        }
        this.navCtrl.back();
      }

      this.dataCtrl.hideLoader();
  }

}
