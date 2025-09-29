import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, firstValueFrom, lastValueFrom, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { UserObject } from '../model/user';

export interface ApiResult {
  data: any;
  message: string;
  status: boolean;
  status_code: number;
  signature: string;
}

export interface ErrorMessage {
  type: AlertType,
  message: string,
  title?: string,
  action?: string
}

export enum AlertType {
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger'
}

export interface AssociativeArray {
  [key: string]: string;
}

const serverURL = environment.rest_server.protokol + environment.rest_server.host;

const TOKEN_KEY = 'access_token';
const TOKEN_KEY_REFRESH = 'refresh_token';
const FCM_TOKEN_KEY = 'fcm_token_key';


const client_id = environment.client_id;
const client_password = environment.client_password;

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  authenticationState = new BehaviorSubject<boolean|null>(null);

  loader: any;

  readyPage = new BehaviorSubject<boolean|null>(null);

  home_page_opened: boolean = false;

  getting_new_access_token = false;
  getting_new_access_client_token = false;

  user: UserObject | null;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private translateCtrl: TranslateService
  ) {
    this.user = null;
  }

  async initFunc(){
    await this.platform.ready();
    await this.createStorage();
    await this.oauthCheckToken();

    if(this.isLogin() == true){
      let data = await this.getUserData().catch(async (err) => {
        if(err.error.error == 'banned user'){
          await this.oauthLogout();
        }else if(err.error.error == 'not verifyed user'){
          // not verifyed user
          // do some action
        }else{
          await this.oauthLogout();
        }
        return undefined;
      });

      if(data != undefined){
        this.user = new UserObject(data['data']);

        // provjeri ako je poslani token sa ovim user id
        // ako nije posalji ponovno sa ovim idjem
        this.setNotificationToken('');
      }


    }
  }

  async getUserData(){
    return new Promise<ApiResult>((res,rej)=>{
      this.getServer('/api/user/user').then((data: ApiResult) => {

        if(data.status == true){
          if(data.message == 'not verifyed user'){
            rej({error: {error: 'not verifyed user', error_description: 'not verifyed user'}});
          }
          else if(data.message == 'banned user'){
            rej({error: {error: 'banned user', error_description: 'banned user'}});
          }
          else{
            res(data);
          }
        }else{
          rej({error: {error: 'server error', error_description: 'server error'}})
        }
      }).catch(err => {
        rej(err);
      });
    });
  }

  setReadyPage(){
    this.readyPage.next(true);
  }

  /**
  * 
  * set if home page is active or inactive
  *
  * @param status true-active, false-inactive
  */
    setHomePage(status: boolean){
      this.home_page_opened = status;
    }

  /**
  * 
  * get if home page is active
  *
  * @returns 
  */
  getHomePageStatus(){
    return this.home_page_opened;
  }

  addParameterToUrl(url: string, parameter_name: string, parameter_value: string): string{

    if(url.includes('?')){
      url = url + '&';
    }else{
      url = url + '?';
    }

    return url + parameter_name + '=' + parameter_value;
  }

  /**
   * 
   * @param url api link
   * @param data to send to server
   * @returns data from server ApiResult object
   */
  async postServer(url: string, data: any): Promise<ApiResult> {
    let access_token = await this.getStorage(TOKEN_KEY);
    let refresh_token = await this.getStorage(TOKEN_KEY_REFRESH);
    let company_id = environment.company_id;

    let promise = new Promise<ApiResult>((resolve, reject) => {
      let apiURL = serverURL + url;
      apiURL = this.addParameterToUrl(apiURL, 'company_id', company_id.toString());
      let options = {};
      if(access_token != null){
        options = {
          headers: new HttpHeaders().append('Authorization', "Bearer " + access_token)
        }
      }else{
        options = {};
      }

      firstValueFrom(
        this.http.post(apiURL, data, options).pipe(take(1))
      )
      .then((res: any) => {
        if(res.status == true && res.data?.valid != false){
          resolve(res);
        }else{
          reject({error: {error: 'server_error', error_description: res.message}, data: res});
        }
      })
      .catch((err) => {
        if(err.status == 401){
          if(refresh_token != null){
            this.oauthGetFreshToken().then(() => {
              this.postServer(url, data).then(data_2 => {
                resolve(data_2);
              }).catch((err_2) => {
                reject(err_2);
              });
            }).catch(err_2 => {
              reject(err_2);
            });
          }
          else{
            // get offline refresh token
            this.oauthClientAuthorize().then(() =>{
              this.postServer(url, data).then(data_2 => {
                resolve(data_2);
              }).catch((err_2) => {
                reject(err_2);
              });
            }).catch((err_2: any) => {
              reject(err_2);
            });
          }
        }else{
          reject(err);
        }
      })


    });

    return promise;
  }

    /**
   * 
   * @param url api link
   * @param data to send to server
   * @returns data from server ApiResult object
   */
  async putServer(url: string, data: any): Promise<ApiResult> {
    let access_token = await this.getStorage(TOKEN_KEY);
    let refresh_token = await this.getStorage(TOKEN_KEY_REFRESH);
    let company_id = environment.company_id;

    let promise = new Promise<ApiResult>((resolve, reject) => {
      let apiURL = serverURL + url;
      apiURL = this.addParameterToUrl(apiURL, 'company_id', company_id.toString());
      let options = {};
      if(access_token != null){
        options = {
          headers: new HttpHeaders().append('Authorization', "Bearer " + access_token)
        }
      }else{
        options = {};
      }

      firstValueFrom(
        this.http.put(apiURL, data, options).pipe(take(1))
      )
      .then((res: any) => {
        if(res.status == true && res.data?.valid != false){
          resolve(res);
        }else{
          reject({error: {error: 'server_error', error_description: res.message}, data: res});
        }
      })
      .catch((err) => {
        if(err.status == 401){
          if(refresh_token != null){
            this.oauthGetFreshToken().then(() => {
              this.putServer(url, data).then(data_2 => {
                resolve(data_2);
              }).catch((err_2) => {
                reject(err_2);
              });
            }).catch(err_2 => {
              reject(err_2);
            });
          }
          else{
            // get offline refresh token
            this.oauthClientAuthorize().then(() =>{
              this.putServer(url, data).then(data_2 => {
                resolve(data_2);
              }).catch((err_2) => {
                reject(err_2);
              });
            }).catch((err_2: any) => {
              reject(err_2);
            });
          }
        }else{
          reject(err);
        }
      })


    });

    return promise;
  }

  /**
   * 
   * @param url api link
   * @returns data from server ApiResult object
   */
  async deleteServer(url: string): Promise<ApiResult> {
    let access_token = await this.getStorage(TOKEN_KEY);
    let refresh_token = await this.getStorage(TOKEN_KEY_REFRESH);
    let company_id = environment.company_id;

    let promise = new Promise<ApiResult>((resolve, reject) => {
      let apiURL = serverURL + url;
      apiURL = this.addParameterToUrl(apiURL, 'company_id', company_id.toString());
      let options = {};
      if(access_token != null){
        options = {
          headers: new HttpHeaders().append('Authorization', "Bearer " + access_token)
        }
      }else{
        options = {};
      }

      firstValueFrom(
        this.http.delete(apiURL, options).pipe(take(1))
      )
      .then((res: any) => {
        if(res.status == true && res.data?.valid != false){
          resolve(res);
        }else{
          reject({error: {error: 'server_error', error_description: res.message}, data: res});
        }
      })
      .catch((err) => {
        if(err.status == 401){
          if(refresh_token != null){
            this.oauthGetFreshToken().then(() => {
              this.deleteServer(url).then(data_2 => {
                resolve(data_2);
              }).catch((err_2) => {
                reject(err_2);
              });
            }).catch(err_2 => {
              reject(err_2);
            });
          }
          else{
            // get offline refresh token
            this.oauthClientAuthorize().then(() =>{
              this.deleteServer(url).then(data_2 => {
                resolve(data_2);
              }).catch((err_2) => {
                reject(err_2);
              });
            }).catch((err_2: any) => {
              reject(err_2);
            });
          }
        }else{
          reject(err);
        }
      })


    });

    return promise;
  }

  /**
   * 
   * @param url api link
   * @param cache if true than the cache is enable
   * @param cache_time the cache time in seconds
   * @returns the data from server ApiResult object
   */
  async getServer(url: string, cache: boolean = false, cache_time: number = 5): Promise<ApiResult> {
    cache_time = cache_time * 1000; //convert to miliseconds
    let access_token = await this.getStorage(TOKEN_KEY);
    let refresh_token = await this.getStorage(TOKEN_KEY_REFRESH);
    let cachedData = await this.checkCache(environment.cache_key + url, cache_time).catch(err => {return undefined;});
    let company_id = environment.company_id;

    if(cache == true){
      if(environment.cache == false){
        cache = false;
      }
    }

    let promise = new Promise<ApiResult>((resolve, reject) => {
      let apiURL = serverURL + url;
      apiURL = this.addParameterToUrl(apiURL, 'company_id', company_id.toString());
      let options = {};
      if(access_token != null){
        options = {
          headers: new HttpHeaders().append('Authorization', "Bearer " + access_token)
        }
      }else{
        options = {};
      }

      if(cache == true && cachedData != undefined){
        if(cachedData.status == true && cachedData.data?.valid != false){
          resolve(cachedData);
        }else{
          reject({error: {error: 'server_error', error_description: cachedData.message}, data: cachedData});
        }
      }else{

        firstValueFrom(
          this.http.get(apiURL, options).pipe(take(1))
        )
        .then((res: any) => {
          if(cache == true){
            let miliseconds = Date.now();

            let cache_data = {
              key: environment.cache_key + url,
              miliseconds: miliseconds,
              res: res
            };

            this.setStorage(cache_data.key, JSON.stringify(cache_data)).then(() => {
              if(res.status == true && res.data?.valid != false){
                resolve(res);
              }else{
                reject({error: {error: 'server_error', error_description: res.message}, data: res});
              }
            });
          }
          else{
            if(res.status == true && res.data?.valid != false){
              resolve(res);
            }else{
              reject({error: {error: 'server_error', error_description: res.message}, data: res});
            }
          }
        })
        .catch((err) => {
          if(err.status == 401){
            if(refresh_token != null){
              this.oauthGetFreshToken().then(() => {
                this.getServer(url, cache, cache_time).then(data_2 => {
                  resolve(data_2);
                }).catch((err_2) => {
                  reject(err_2);
                });
              }).catch(err_2 => {
                reject(err_2);
              });
            }
            else{
              // get offline refresh token
              this.oauthClientAuthorize().then(() =>{
                this.getServer(url, cache, cache_time).then(data_2 => {
                  resolve(data_2);
                }).catch((err_2) => {
                  reject(err_2);
                });
              }).catch((err_2: any) => {
                reject(err_2);
              });
            }
          }else{
            reject(err);
          }
        })
      }
    });

    return promise;
  }

  oauthGetFreshToken(){
    return new Promise((res,rej)=>{
      let serverUrl_token = serverURL + environment.rest_server.functions.token;
      if(!this.getting_new_access_token) {
        this.getting_new_access_token = true;

        let refresh_token: string = '';
        this.getStorage(TOKEN_KEY_REFRESH).then(refresh_token => {
          let postObj = {
            grant_type: 'refresh_token',
            client_id: client_id,
            client_secret: client_password,
            refresh_token:  refresh_token
          };

          firstValueFrom(
            this.http.post(serverUrl_token, postObj).pipe(take(1))
          )
          .then((result: any) => {
            this.setStorage(TOKEN_KEY, result['access_token']);
            this.setStorage(TOKEN_KEY_REFRESH, result['refresh_token']);
            this.getting_new_access_token = false;
            res(true);
          })
          .catch((err) => {
            console.log(err);
            if(err.status == 400){
              if(err.error.error == 'invalid_grant' || err.error.error == 'invalid_request'){
                this.oauthLogout().then(() => {
                  window.location.reload();
                  rej(false);
                });
              }
            }
          })
        });
      }
      else{
        // we are already gettting a new token, lets just wait untill we get the new one and resolve the promise
        let ticker = setInterval(()=>{
          if(!this.getting_new_access_token) {
            clearInterval(ticker);
            res(true);
          }else{
            return rej(false);
          }
        },10);
      }
    });
  }

  isLogin() {
    return this.authenticationState.value;
  }

  async oauthCheckToken(){
    let token: string = '';
    let token_refresh: string = '';

    token = await this.getStorage(TOKEN_KEY);
    token_refresh = await this.getStorage(TOKEN_KEY_REFRESH);

    if(token != null && token_refresh != null){
      this.authenticationState.next(true);
    }
    else{
      this.authenticationState.next(false);
    }
  }

  async oauthLogout(){
    await this.removeStorage(TOKEN_KEY);
    await this.removeStorage(TOKEN_KEY_REFRESH);
    await this.deleteAllCache();
    this.user = null;
    
    this.authenticationState.next(false);

    // provjeri ako je poslani token sa ovim user id
    // ako nije posalji ponovno sa ovim idjem
    await this.setNotificationToken('');
  }

  async deleteAllCache(){
    let storageList =  await this.getAllStorageKeys();
    for (let index = 0; index < storageList.length; index++) {
      if(storageList[index].startsWith(environment.cache_key) == true){
        await this.removeStorage(storageList[index]);
      }
    }
  }

  getAllStorageKeys() {
    let list: Array<any> = [];
    var promise = new Promise<Array<any>>((resolve, reject) => {
      this.storage.forEach((value, key, index) => {
        list.push(key);
      }).then((d) => {
        resolve(list);
      });
    });
    return promise;
  }

  async _getNotificationTokenFromStorage(){
    let token_string = await this.getStorage(FCM_TOKEN_KEY);
    let token_obj: {
      token: string,
      user: number,
      send: boolean
    };
    if(token_string != null){
      token_obj = JSON.parse(token_string);
    }else{
      token_obj = {
        token: '',
        user: 0,
        send: false
      };
    }
    
    return token_obj;
  }

  async setNotificationToken(token: string){
    let old_token = await this._getNotificationTokenFromStorage();

    let loged_user = 0;
    let sendToken: boolean = false;

    // ako ne saljem token u funckiju
    // onda uzmi stari token
    // ovo koristim kao trigger za promjenu usera
    if(token == ''){
      token = old_token.token;
    }

    if(this.isLogin() == true){
      loged_user = this.user?.user_id || 0;
    }

    //fKP36EkxQ0aeKodd4TYv6Y:APA91bFIxDDHlF0x88VXHlVEt_qogFRZUgE3Zy9XtwrP6Q66YjzO-LVw89BFFuazrSIRSC1gxDJSxTGkWymWen94J5VX_XR5lCW-eLMZ-gsap6dJFEF9GFdHVKJXk46745dqL4pzzuvx

    // ako token nije isti kao stari
    // onda ga salji ponovno
    if(old_token.token != token){
      sendToken = true;
    }

    // ako user nije isti kao stari
    // onda token salji ponovno
    if(old_token.user != loged_user){
      sendToken = true;
    }

    if(token == ''){
      sendToken = false;
    }

    let promise = new Promise((resolve, reject) => {
      if(sendToken == true){
        let data = {
          token: token,
          company: environment.company_id
        };

        this.postServer('/api/notification/token', data).then((data: ApiResult)=> {
          if(data.status == true){
            let store_string = JSON.stringify({
              token: token,
              user: loged_user
            });
            this.setStorage(FCM_TOKEN_KEY, store_string).then(() => {
              resolve(true);
            })
          }
          else{
            resolve(true);
          }
        });
      }
      else{
        resolve(true);
      }
    });
    return promise;
  }


  async parseErrorMessage(error: any): Promise<ErrorMessage>{
    let errorMessage: ErrorMessage = {title: '', message: '', type: AlertType.Warning};
    let sub_error = error?.error || undefined;

    if(sub_error != undefined){
      let sub_error_title = sub_error?.error || undefined;
      let sub_error_description = sub_error?.error_description || undefined;
      errorMessage.type = AlertType.Warning;

      if(sub_error_title != undefined){
        errorMessage.title = sub_error_title;
      }else{
        errorMessage.title = 'unknown error';
      }

      if(sub_error_description != undefined){
        errorMessage.message = sub_error_description;
      }else{
        errorMessage.title = 'unknown error';
      }

      if(sub_error_title == 'invalid_client'){
        //"The client credentials are invalid"
      }
      else if(sub_error_title == 'the token did not arrive'){
        errorMessage.title = 'Unauthorized';
        errorMessage.message = 'Unauthorized';
        errorMessage.type = AlertType.Warning;
      }

      return errorMessage;

    }
    else{
      errorMessage.title = 'unknown error';
      errorMessage.message = 'unknown error';
      errorMessage.type = AlertType.Warning;
      return errorMessage;
    }
  }


  async oauthClientAuthorize(){
    await this.platform.ready();
    let serverUrl_token = serverURL + environment.rest_server.functions.token;

    let promise = new Promise((res, rej) => {
      if(!this.getting_new_access_client_token) {
        this.getting_new_access_client_token = true;
  
        // create the data to be posted
        var postObj = {
          grant_type: 'client_credentials',
          client_id: client_id,
          client_secret: client_password
        };

        firstValueFrom(
          this.http.post(serverUrl_token, postObj).pipe(take(1))
        )
        .then((data: any) => {
          this.setStorage(TOKEN_KEY, data['access_token']).then(() => {
            this.getting_new_access_client_token = false;
            res(true);
          });
        })
        .catch((err) => {
          // it is imposible to get the offline token
          rej(err);
        });  
      }else{
        // we are already getting a new token, lets just wait untill we get the new one and resolve the promise
        let ticker = setInterval(()=>{
          if(!this.getting_new_access_client_token) {
            clearInterval(ticker);
            res(true);
          }else{
            rej(new Error('the token did not arrive'));
          }
        },300);
      }
    });
    return promise;
  }

  async oauthAuthorize(username: string, password: string){
      let serverUrl_token = serverURL + environment.rest_server.functions.token;
      username = (username != null ? username.trim() : '');
      password = (password != null ? password.trim() : '');

      await this.platform.ready();

      // create the data to be posted
      var postObj;

      postObj = {
        grant_type: 'password',
        client_id: client_id,
        client_secret: client_password,
        username: username,
        password: password,
        company: environment.company_id
      };

      let data: any = await firstValueFrom(this.http.post(serverUrl_token, postObj).pipe(take(1))).catch(err => {
        
        if(err.status == 400){
          if(err.error.error == 'invalid_grant'){
            this.oauthLogout().then(() => {
              throw(err);
            });
          }
        }else{
          throw(err);
        }
        
        return undefined; 
      });

      if(data != undefined){
        await this.setStorage(TOKEN_KEY, data['access_token']);
        await this.setStorage(TOKEN_KEY_REFRESH, data['refresh_token']);
        let userData = await this.getUserData().catch(err => {
          throw(err);});

        if(userData != undefined){
          this.user = new UserObject(userData.data);
          await this.setNotificationToken('');
          await this.deleteAllCache();
          this.authenticationState.next(true);
          return userData;
          //this.setNotificationNumberChange();
        }else{
          return null;
        }
      }else{
        return null;
      }
  }


  public checkCache(key: string, cache_time: number|null): Promise<ApiResult>{
    let promise = new Promise<ApiResult>((resolve, reject) => {
        this.getStorage(key).then(data_str => {
          if(data_str != null){
            let data = JSON.parse(data_str);
            let timeNow = Date.now();
            if((data.miliseconds + cache_time >= timeNow) || cache_time == null){
              resolve(data.res);
            }
            else{
              reject(new Error("cache data expired"));
            }
          }
          else{
            reject(new Error("cache data not exist"));
          }
        }).catch(() =>{ 
          reject(new Error("cache data read error"));
        });
    });
    return promise;
  }

  translateWord(key: string): Promise<string>{
    let promise = new Promise<string>((resolve, reject) => {
      this.translateCtrl.get(key).toPromise().then( value => {
        resolve(value);
        }
      );
    });
    return promise;
  }

  async showToast(message: string, color: AlertType = AlertType.Success) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color
    });

    await toast.present();
  }

  async showLoader(): Promise<void> {
    this.loader = await this.loadingCtrl.create({
      spinner: 'circles',
    });

    this.loader.present();
  }

  async hideLoader(): Promise<void>{
    await this.loader.dismiss();
    this.loader = null;
  }

  async setStorage($key: string, $data: string){
    return await this.storage.set($key, $data);
  }

  async getStorage($key: string){
      return await this.storage.get($key);
  }

  async removeStorage($key: string){
    return await this.storage.remove($key);
  }

  async createStorage(){
    return await this.storage.create();
  }
}


