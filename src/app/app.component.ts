import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
import { TranslateConfigService } from './services/translate-config.service';
import { ControllerService } from './services/controller.service';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { environment } from 'src/environments/environment';
import { CompanySettingsObject } from './model/app_settings';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  @ViewChild(IonRouterOutlet, { static: false }) routerOutlet: IonRouterOutlet | undefined;

  constructor(
    private router: Router,
    public platform: Platform,
    public translateConfigService: TranslateConfigService,
    public dataCtrl: ControllerService,
    private alertController: AlertController
  ) {
    this.initApp();
  }

  async initApp(){
    await this.platform.ready();

    // define android exit app (whet user press back)
    this.platform.backButton.subscribeWithPriority(11, () => {

      if(this.routerOutlet != undefined){
        // ako vise nejde undo
        if (!this.routerOutlet.canGoBack()) {
          // ako je otvorena home stranica
          // onda iskljuci aplikaciju
          if(this.dataCtrl.getHomePageStatus() == true){
            App.exitApp();
          }
          else{
            this.router.navigateByUrl('/tabs/trevel-order');
          }
        }
        else{
          this.routerOutlet.pop();
        }
      }

    });

    this.translateConfigService.getDefaultLanguage();

    // provjera login
    // kreiranje ionic storage
    await this.dataCtrl.initFunc();

    this.setReadyPage();
  }

  async setReadyPage(){
    // nakon sto se stranica pokrene ugasiti splash screen
    if(this.platform.is('cordova') || this.platform.is('capacitor')){
      await SplashScreen.hide();
      await StatusBar.show();

      // crna slova na statusbaru
      await StatusBar.setStyle({ style: Style.Dark });

      // pokreni inicijalizaciju notifikacija
      // await this.initNotifications();
    }

    await this.getAppSettings();

    // izvrisit sve provjere i funkcije prije ove funkcije
    // jer tek kad se pokrene ova funkcija dozvoljava se 
    // pokretanje prve stranice
    this.dataCtrl.setReadyPage();
  }

  async getAppSettings(){
    let app_settings = await this.dataCtrl.getServer('/api/user/app_settings/?company_id=' + environment.company_id, true, 20).catch(err => {
      this.dataCtrl.parseErrorMessage(err).then(message => {
        this.dataCtrl.showToast(message.message, message.type);
          if(message.title == 'server_error'){
            // take some action e.g logout, change page
          }
      });
      return undefined;
    });

    if(app_settings != undefined){      
      let settings_object = new CompanySettingsObject(app_settings['data']);
    
  
      if(settings_object.show_message == true){
        let show_message = await this.dataCtrl.getStorage('UPDATE_MESSAGE');
  
        if(show_message != 'SET'){
            await this.dataCtrl.setStorage('UPDATE_MESSAGE', 'SET');
            const alert = await this.alertController.create({
              header: await this.dataCtrl.translateWord("UPDATE.TITLE"),
              subHeader: await this.dataCtrl.translateWord("UPDATE.SUB_TITLE") + ' v' + settings_object.company_app_version_display,
              message: await this.dataCtrl.translateWord("UPDATE.TEXT"),
              buttons: [await this.dataCtrl.translateWord("UPDATE.ACTION")],
            });
            await alert.present();
        }
      }
      
      // if(settings_object.show_update_page == true){
      //   // open update page
      // }
    }
  
   }
}
