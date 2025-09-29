import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AlertType, ControllerService } from 'src/app/services/controller.service';

@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.page.html',
  styleUrls: ['./my-data.page.scss'],
  standalone: false
})
export class MyDataPage implements OnInit {

  e_mail: string = '';
  name: string = '';
  lastname: string = '';
  address: string = '';
  city: string = '';
  phone: string = '';

  has_orders: boolean = false;
  history_empty: string = '';

  constructor(
    private router: Router,
    private dataCtrl: ControllerService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    //
  }

  async ionViewWillEnter() {
    await this.initTranslate();
    await this.dataCtrl.showLoader();
    this.getUserData();
    await this.dataCtrl.hideLoader();
  }

  getUserData(){
    this.e_mail = this.dataCtrl.user?.user_email || '-';
    this.name = this.dataCtrl.user?.user_firstname || '-';
    this.lastname = this.dataCtrl.user?.user_lastname || '-';
    this.address = this.dataCtrl.user?.user_address || '-';
    this.city = this.dataCtrl.user?.user_city || '-';
    this.phone = this.dataCtrl.user?.user_phone || '-';
  }

  editData(){
    this.router.navigateByUrl('/tabs/my-data/edit-data');

  }
  editPassword(){
    this.router.navigateByUrl('/tabs/my-data/edit-password');
  }

  openOrderList(){
    this.router.navigateByUrl('/tabs/my-data/all-orders');
  }

  async logout(){
    if(this.dataCtrl.isLogin() == true){
      await this.dataCtrl.showLoader();
      await this.dataCtrl.oauthLogout();
      await this.dataCtrl.hideLoader();
      this.router.navigateByUrl('/tabs/orders');
    }
    else{
      //not login
    }
  }

  async delete(){
    const alert = await this.alertController.create({
      header: await this.dataCtrl.translateWord("MY_DATA.DELETE"),
      message: await this.dataCtrl.translateWord("MY_DATA.DELETE_MESSAGE"),
      buttons: [
        {
          text: await this.dataCtrl.translateWord("BUTTON.CANCEL"),
          role: 'cancel',
          handler: () => {
            //
          },
        },
        {
          text: await this.dataCtrl.translateWord("BUTTON.OK"),
          role: 'confirm',
          handler: () => {
            this.deleteServer();
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteServer(){
    await this.dataCtrl.showLoader();
    let response = await this.dataCtrl.deleteServer('/api/user/user/' + this.dataCtrl.user?.user_id).catch(err => {
      this.dataCtrl.parseErrorMessage(err).then(message => {
        this.dataCtrl.showToast(message.message, message.type);
          if(message.title == 'server_error'){
            // take some action e.g logout, change page
          }
      });
      return undefined;
    });

    await this.dataCtrl.hideLoader();

    if(response != undefined){
      await this.logout();
      let message = await this.dataCtrl.translateWord('MY_DATA.DELETE_SUCCESS');
      this.dataCtrl.showToast(message, AlertType.Success);
    }

  }

  async initTranslate(){
    this.history_empty = await this.dataCtrl.translateWord("MY_DATA.NO_HISTORY");
  }



}
