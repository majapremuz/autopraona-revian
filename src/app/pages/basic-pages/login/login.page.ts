import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyObject } from 'src/app/model/user';
import { AlertType, ApiResult, ControllerService } from 'src/app/services/controller.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  credentials: FormGroup;
  foregtPasswordForm: FormGroup;

  password_show: boolean = false;
  passwrod_icon: string = 'eye-outline';
  password_type: string = 'password';

  isModalOpen: boolean = false;

  back_str: string = '';
  back_button: string = 'tabs/travel-order';

  forgot_password_message: string = '';
  production: boolean = false;

  company_data?: CompanyObject;
  company_data_loaded: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    public dataCtrl: ControllerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

    let email = '';
    let password = '';

    if(environment.production == false){
      email= 'matija.fsb@gmail.com';
      password= 'Test12345';
    }

    this.credentials = this.fb.group({
      email: [email, [Validators.required, Validators.email]],
      password: [password, [Validators.required, Validators.minLength(8)]],
    });

    this.foregtPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.getCompanyData();
  }

  async getCompanyData(){
    await this.dataCtrl.showLoader();
    let data = await this.dataCtrl.getServer('/api/company/company_offline?id=' + environment.company_id).catch(err => {
      return undefined;
    });
    this.dataCtrl.hideLoader();

    if(data != undefined){
      this.company_data = new CompanyObject(data['data'][0]);
      this.company_data_loaded = true;
    }
  }


  ngOnInit() {

    this.back_str = this.activatedRoute.snapshot.queryParamMap.get('returnto') || 'tabs/travel-order';

    if(environment.production == true){
      this.production = true;
    }else{
      this.production = false;
    }

    this.initTranslate();

    if(this.dataCtrl.isLogin() == true){
      this.router.navigateByUrl('/tabs/travel-order');
    }

  }

  async initTranslate(){
    this.forgot_password_message = await this.dataCtrl.translateWord("LOGIN.FORGOT_PASS_MESAGE");
  }

  register(){
    this.router.navigate(['/register'], { queryParams: { returnto: this.back_str}});
  }

  forgetPassword(){
    let email = this.foregtPasswordForm.value.email;

    this.dataCtrl.showLoader().then(() => {
      this.dataCtrl.getServer('/api/user/password?email=' + email).then((data: ApiResult) => {
        this.dataCtrl.hideLoader();

        if(data.status == true){
          if(data.message == 'already sent'){
            this.dataCtrl.translateWord('LOGIN.FORGOT_PASS_SENT').then(data => {
              this.dataCtrl.showToast(data, AlertType.Warning);
            });
          }
          else if(data.message == 'user not exist' || data.message == 'wrong input parameters'){
            this.dataCtrl.translateWord('LOGIN.USER_NOT_EXIST').then(data => {
              this.dataCtrl.showToast(data, AlertType.Warning);
            });
          }
          else{
            this.dataCtrl.translateWord('LOGIN.SUCCESS').then(data => {
              this.dataCtrl.showToast(data, AlertType.Success);
            });
          }
        }
        else{
          this.dataCtrl.translateWord('MESSAGES.SERVER_ERROR').then(data => {
            this.dataCtrl.showToast(data, AlertType.Warning);
          });
        }

        //this.forget_email.setValue("");
        this.closeModal();

      }).catch(err => {
        console.log('err', err);
        this.dataCtrl.hideLoader();
        this.dataCtrl.translateWord('MESSAGES.SERVER_ERROR').then(data => {
          this.dataCtrl.showToast(data, AlertType.Warning);
        });
      });
    });

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

  openForgetPassword(){
    this.openModal();
  }

  openModal(){
    this.isModalOpen = true;
  }

  closeModal(){
    this.isModalOpen = false;
  }

  onWillDismiss(event: Event) {
    this.closeModal();
  }

  async login(){
    let email = this.credentials.value.email;
    let password = this.credentials.value.password;

    await this.dataCtrl.showLoader();

    let data = await this.dataCtrl.oauthAuthorize(email, password).catch( async (err) => {
      if(err.status == 401 && err.error.error == 'invalid_grant'){
          let data_message = await this.dataCtrl.translateWord('MESSAGES.WRONG_LOGIN_DATA');
          this.dataCtrl.showToast(data_message, AlertType.Warning);
      }else if(err.error.error == 'banned user'){
        let data_message = await this.dataCtrl.translateWord('MESSAGES.ACCOUNT_BAN');
        this.dataCtrl.showToast(data_message, AlertType.Warning);
      }else if(err.error.error == 'not verifyed user'){
        // not verifyed user
        // do some action
      }
      await this.dataCtrl.hideLoader();
      return undefined;
    });

    if(data != undefined){
      let data_message = await this.dataCtrl.translateWord('MESSAGES.SUCCESS_LOGIN');
      this.dataCtrl.showToast(data_message, AlertType.Success);
      await this.dataCtrl.hideLoader();
      this.router.navigateByUrl(this.back_str);
    }


  }

  get email(){
    return this.credentials.get('email');
  }

  get forget_email(){
    return this.foregtPasswordForm.get('email');
  }

  get password(){
    return this.credentials.get('password');
  }

}
