import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AlertType, ApiResult, ControllerService } from 'src/app/services/controller.service';
import { createPasswordStrengthValidator } from 'src/app/validators/validators';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.page.html',
  styleUrls: ['./edit-password.page.scss'],
  standalone: false
})
export class EditPasswordPage implements OnInit {

  form_password_user: FormGroup;

  password_show: boolean = false;
  passwrod_icon: string = 'eye-outline';
  password_type: string = 'password';

  password_old_show: boolean = false;
  passwrod_old_icon: string = 'eye-outline';
  password_old_type: string = 'password';
  
  constructor(
    private dataCtrl: ControllerService,
    private fb: FormBuilder,
    private navCtrl: NavController 
  ) {
    this.form_password_user = this.fb.group({
      old_password: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), createPasswordStrengthValidator()]],
    });
  }

  ngOnInit() {
  //
  }

  password_toggle(){
    if(this.password_show == true){
      this.password_show = false;
      this.passwrod_icon = 'eye-outline';
      this.password_type = 'password';
    }
    else{
      this.password_show = true;
      this.passwrod_icon = 'eye-off-outline';
      this.password_type = 'text';
    }
  }

  password_old_toggle(){
    if(this.password_old_show == true){
      this.password_old_show = false;
      this.passwrod_old_icon = 'eye-outline';
      this.password_old_type = 'password';
    }
    else{
      this.password_old_show = true;
      this.passwrod_old_icon = 'eye-off-outline';
      this.password_old_type = 'text';
    }
  }

  editUserPassword(){
      let send_data = {
        password: this.form_password_user.value.password,
        old_password: this.form_password_user.value.old_password
      };

      this.dataCtrl.showLoader().then(() => {
        this.dataCtrl.putServer('/api/user/password', send_data).then((data : ApiResult) => {
          if(data.status == true){
            if(data.message == 'success' && data.status == true){
              this.dataCtrl.translateWord('EDIT_USER.PASSWORD_SUCCESS').then(data => {
                this.dataCtrl.showToast(data, AlertType.Success);
              });

              this.form_password_user.controls['password'].setValue('');
              this.form_password_user.controls['old_password'].setValue('');

              this.form_password_user.controls['old_password'].reset();
              this.form_password_user.controls['password'].reset();

              this.navCtrl.back();
            }else{

              if(data.message == 'old password not match'){
                this.dataCtrl.translateWord('EDIT_USER.OLD_PASSWORD_MISMATCH').then(data => {
                  this.dataCtrl.showToast(data, AlertType.Warning);
                });
              }else{
                this.dataCtrl.translateWord('MESSAGES.SERVER_ERROR').then(data => {
                  this.dataCtrl.showToast(data, AlertType.Warning);
                });
              }
            }
          }
          else{
            this.dataCtrl.translateWord('MESSAGES.SERVER_ERROR').then(data => {
              this.dataCtrl.showToast(data, AlertType.Warning);
            });
          }
          this.dataCtrl.hideLoader();
        }).catch(err => {
          this.dataCtrl.translateWord('MESSAGES.SERVER_ERROR').then(data => {
            this.dataCtrl.showToast(data, AlertType.Warning);
          });
          this.dataCtrl.hideLoader();
        });
      });
  }

}
