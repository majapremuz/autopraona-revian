import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { AlertType, ApiResult, ControllerService } from 'src/app/services/controller.service';
import { createPasswordStrengthValidator } from 'src/app/validators/validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {

  back_button_string: string = '/login';
  back_str: string = '';

  register_form: FormGroup;

  password_show: boolean = false;
  passwrod_icon: string = 'eye-outline';
  password_type: string = 'password';

  constructor(
    private fb: FormBuilder,
    private dataCtrl: ControllerService,
    public navCtrl: NavController,
    private platform: Platform,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.register_form = this.fb.group({
      email: ['', {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.userExistsValidator()],
          updateOn:  'change'
      }],
      password: ['', [Validators.required, Validators.minLength(8), createPasswordStrengthValidator()]],
     // gdpr: [false, [Validators.requiredTrue]],
     // terms: [false, [Validators.requiredTrue]]
    });
    //this.register_form.setValidators([phone_validator()]);
  }

  ngOnInit() {
    this.back_str = this.activatedRoute.snapshot.queryParamMap.get('returnto') || 'tabs/home';

    if(this.dataCtrl.isLogin() == true){
      this.router.navigateByUrl('/tabs/orders');
    }
  }

  openGDPR(){
    //this.router.navigateByUrl('/static/1');
  }

  openTerms(){
    //this.router.navigateByUrl('/static/2');
  }

  userExistsValidator():AsyncValidatorFn  {
    return (control: AbstractControl) => {
        let email = control.value;
        let encode_email = encodeURIComponent(email);
          return this.dataCtrl.getServer('/api/user/check_user_exist/' + encode_email + '?company_id=' + environment.company_id).then((data: ApiResult) => {
            if(data?.status == true){
              if(data.message == "username exist"){
                return {userExist:true};
              }
              else{
                return {userExist:false}
              }
            }
            else{
              return null;
            }
          }).catch(err => {
            if(err?.status == true){
              if(err.data?.message == 'username do not exist'){
                return {userExist:false}
              }else{
                return {userExist:true}
              }
            }else{
              return null;
            }
          });
    }
  }

  async register(){
    let platform = this.testPlatform();
    let email = this.register_form.value.email;
    let password = this.register_form.value.password;

    let send_data = {
      user_email: email,
      user_password: password,
      user_platform: platform,
      user_company: environment.company_id,
      user_app: 'Y'
    };

    // show loader
    await this.dataCtrl.showLoader();

    let data = await this.dataCtrl.postServer('/api/user/user', send_data).catch(err => {
      this.dataCtrl.parseErrorMessage(err).then(message => {
        this.dataCtrl.showToast(message.message, message.type);

        if(message.title == 'server_error'){
          // take some action e.g logout, change page
        }
      });
      return undefined;
    });


    if(data != undefined){
      let data_login = await this.dataCtrl.oauthAuthorize(email, password).catch( async (err) => {
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
  
        return undefined;
      });

      // hide loader
      await this.dataCtrl.hideLoader();

      if(data_login != undefined){
        let data_message = await this.dataCtrl.translateWord('MESSAGES.SUCCESS_REGISTER');
        this.dataCtrl.showToast(data_message, AlertType.Success);
        this.router.navigateByUrl(this.back_str);
      }
    }else{
      // hide loader
      await this.dataCtrl.hideLoader();
    }

  }

  register_old(){
    let platform = this.testPlatform();
    let email = this.register_form.value.email;
    let password = this.register_form.value.password;

    let send_data = {
      user_email: email,
      user_password: password,
      user_platform: platform,
      user_company: environment.company_id,
      user_app: 'Y'
    };

    // this.dataCtrl.showLoader().then(() => {
    //   this.dataCtrl.postServer('/api/user/user', send_data).then((data: ApiResult) => {
    //     if(data.status == true){

    //       if(data.message == 'success'){
    //         this.dataCtrl.oauthAuthorize(email, password).then( data => {

    //           this.dataCtrl.hideLoader();
    //           if(data === 'login'){      
    //               this.router.navigateByUrl(this.back_str);
      
    //               this.dataCtrl.translateWord("MESSAGES.SUCCESS_LOGIN").then(translate_word => {
    //                 this.dataCtrl.showToast(translate_word, AlertType.Success);
    //               });
    //           }
    //           else if(data == 'banned'){
    //             this.dataCtrl.translateWord("MESSAGES.ACCOUNT_BAN").then(translate_word => {
    //               this.dataCtrl.showToast(translate_word, AlertType.Success);
    //             });
    //           }
    //           else if(data === 'not_ver'){
    //             // user is login
    //             this.router.navigateByUrl('/verify');
      
    //           }
    //         }).catch(err => {
    //           console.log(err);

    //           this.dataCtrl.hideLoader();
    //           if(err.status == 401 && err.error.error == 'invalid_grant'){
    //             this.dataCtrl.translateWord('MESSAGES.WRONG_LOGIN_DATA').then(data => {
    //               this.dataCtrl.showToast(data, AlertType.Warning);
    //             });
    //           }
    //           else{
    //             console.log(err);
    //           }
    //         });
    //       }
    //       else{
    //         this.dataCtrl.hideLoader();
    //         this.dataCtrl.translateWord('MESSAGES.SERVER_ERROR').then(data => {
    //           this.dataCtrl.showToast(data, AlertType.Warning);
    //         });
    //       }
    //     }else{
    //       this.dataCtrl.hideLoader();
    //       this.dataCtrl.translateWord('MESSAGES.SERVER_ERROR').then(data => {
    //         this.dataCtrl.showToast(data, AlertType.Warning);
    //       });
    //     }

    //   }).catch((err) => {
    //     this.dataCtrl.hideLoader();
    //     this.dataCtrl.translateWord('MESSAGES.SERVER_ERROR').then(data => {
    //       this.dataCtrl.showToast(data, AlertType.Warning);
    //     });
    //     console.log(err);
    //   });
    // });
  }

  testPlatform(){
    if(this.platform.is('ios')){
      return 'ios';
    }else if(this.platform.is('android')){
      return 'android';
    }
    else{
      return '';
    }
  }

  login(){
    this.router.navigateByUrl('/login');
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

  get email(){
    return this.register_form.get('email');
  }

  get password(){
    return this.register_form.get('password');
  }



}
