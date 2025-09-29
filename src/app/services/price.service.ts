import { Injectable } from '@angular/core';
import { ControllerService } from './controller.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { PriceGroupObject } from '../model/reservation_model';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  newData = new BehaviorSubject(false);
  url: string = `/api/reservation/prices_public?company_id=${environment.company_id}`;
  content: Array<PriceGroupObject> = [];
  content_signature: string = '';
  loader: boolean = false;

  constructor(
    private apiCtrl: ControllerService
  ) {
    //this.getContentLoad();
  }

  private async checkCache(){
    let url: string = this.url;

    // first check cache
    let cachedData = await this.apiCtrl.checkCache(environment.cache_key + url, null).catch(err => {return undefined;});

    if(cachedData != undefined && cachedData?.status == true && cachedData?.message == 'success'){
      if(cachedData?.signature != this.content_signature){
        // new data
        this.content = [];
        cachedData.data.map((item:any) => {
          let object_content = new PriceGroupObject(item);
          this.content.push(object_content);
        });
        this.content_signature = cachedData?.signature;
        console.log('new fresh data from cache');
        this.newData.next(true);
      }else{
        // do nothing because data is same like before
      }
      return true;
    }else{
      return false;
    }
  }

  private async checkServer(){
    let url: string = this.url;
    let cache_time:number;
    if(environment.production) {
      cache_time = 60*60*2; // 6 hours
    }else{
      cache_time = 60 * 5; // 5sec
    }
    let response = await this.apiCtrl.getServer(url, true, cache_time).catch(err => {
      return undefined;
    });

    if(response != undefined && response?.['message'] == 'success'){
      if(response['signature'] != this.content_signature){
        // new data
        this.content = [];
        response['data'].map((item:any) => {
          let object_content = new PriceGroupObject(item);
          this.content.push(object_content);
        });
        this.content_signature = response['signature'];
        console.log('get new data dfrom server');
        this.newData.next(true);
      }else{
        // do nothing because data is same like before
      }
      return true;
    }else{
      return false;
    }
  }

  private async getContentLoad(){
    let server: boolean = false;
    let cache: boolean = await this.checkCache();
    if(!cache){
      if(this.loader == false){
        this.loader = true;
        await this.apiCtrl.showLoader();
      }
      server = await this.checkServer();
      if(this.loader == true){
        this.loader = false;
        await this.apiCtrl.hideLoader();
      }
    }
    else{
      this.checkServer();
    }
    return (server || cache);
  }

  async getAllPrices(){
    await this.getContentLoad();

    return this.content;
  }
}
