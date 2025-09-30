import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timeout } from 'rxjs';
import { PeridObject, ReservationIntervalObject, ReservationObjectObject } from 'src/app/model/reservation_model';
import { ControllerService } from 'src/app/services/controller.service';
import { DateService } from 'src/app/services/date.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: false
})
export class OrdersPage implements OnInit {

  progress: boolean = false;
  data_load: boolean = false;

  reservation_objects: Array<ReservationObjectObject> = [];
  reservation_object_select_id: number = 0;

  reservation_intervals: Array<ReservationIntervalObject> = [];
  reservation_interval_select_id: number = 0;

  periods: Array<PeridObject> = [];

  order_type_str: string = '';
  ok_str: string = '';
  cancel_str: string = '';
  no_work_text: string = '';
  old_date_text: string = '';
  out_of_date_text: string = '';


  date: string = '2023-01-01';
  min_date: string = '2025-09-20';
  display_date: string = 'uto., 01.01.2023';
  day: string = '01';
  month: string = '01';
  year: string = '2023';

  object_does_not_work: boolean = false;
  old_date: boolean = false;
  out_of_date: boolean = false;

  constructor(
    private apiCtrl: ControllerService,
    private dateCtrl: DateService,
    private router: Router
  ) {
    //
  }

  async ngOnInit() {

    this.parseDate();
    this.min_date = this.dateCtrl.getMinDate();

    this.order_type_str = await this.apiCtrl.translateWord('ORDER.CHOSE_ORDER');
    this.ok_str = await this.apiCtrl.translateWord('BUTTON.OK');
    this.cancel_str = await this.apiCtrl.translateWord('BUTTON.CANCEL');
    this.no_work_text = await this.apiCtrl.translateWord('ORDER.NOT_WORK');
    this.old_date_text = await this.apiCtrl.translateWord('ORDER.OLD_DATE');
    this.out_of_date_text = await this.apiCtrl.translateWord('ORDER.OUT_OF_DATE');


    await this.apiCtrl.showLoader();
    await this.getReservationObjects();
    await this.changeObject(this.reservation_object_select_id, false);
    await this.loadPeriods(false);
    this.data_load = true;
    await this.apiCtrl.hideLoader();
  }

  parseDate(){
    this.day = this.dateCtrl.getDay();
    this.month = this.dateCtrl.getMonth();
    this.year = this.dateCtrl.getYear();
    this.date = this.year + '-' + this.month + '-' + this.day;

    this.display_date = this.dateCtrl.getDay() + '. ' + this.dateCtrl.getMonth(true) + ' ' + this.dateCtrl.getYear() + '., ' + this.dateCtrl.getDay(true);
  }

  async clickAddDay(){
    if(!this.progress){
      this.dateCtrl.addDay();
      this.parseDate();
      await this.loadPeriods(true);
    }
  }

  async clickSubDay(){
    let check = this.dateCtrl.checkOldDate(this.date);
    if(!this.progress && !check){
      this.dateCtrl.subDay();
      this.parseDate();
      await this.loadPeriods(true);
    }
  }

  async clickToday(){
    if(!this.progress){
      this.dateCtrl.setToday();
      this.parseDate();
      await this.loadPeriods(true);
    }
  }

  async onDatePicked(e: any){
    let date = e.detail.value;
    let date_form = this.dateCtrl.parseDate(date);

    this.dateCtrl.setDate(date_form);
    this.parseDate();
    await this.loadPeriods(true);
  }



  async getReservationObjects(){
    let url: string = `/api/reservation/reservation_objects_public?sort_dir=asc`;

    let response = await this.apiCtrl.getServer(url, true, 60*60*2).catch(err => {
      return undefined;
    });

    if(response != undefined && response?.['message'] == 'success'){
      this.reservation_objects = [];
      response['data']['data'].map((item:any, index: number) => {
        this.reservation_objects.push(new ReservationObjectObject(item));
        if(index == 0){
          this.reservation_object_select_id = item['reservation_object_id'];
        }
      })
    }else{
      this.reservation_objects = [];
    } 
  }

  async clickChangeObject(e: any){
    this.reservation_object_select_id = e.detail.value;
    await this.changeObject(this.reservation_object_select_id, true);
    await this.loadPeriods(true);
  }

  async changeObject(id: number, indicator: boolean){
    this.progress = (indicator == false ? false : true);

    let url: string = `/api/reservation/reservation_intervals_public?reservation_object=${id}`;

    let response = await this.apiCtrl.getServer(url, true, 60*60*2).catch(err => {
      return undefined;
    });

    if(response != undefined && response?.['message'] == 'success'){
      this.reservation_intervals = [];
      response['data']['data'].map((item:any, index: number) => {
        this.reservation_intervals.push(new ReservationIntervalObject(item));
        if(index == 0){
          this.reservation_interval_select_id = item['reservation_interval_id'];
        }
      })
    }else{
      this.reservation_intervals = [];
    }

    this.progress = false;
  }

  clickChangeInterval(e: any){
    this.reservation_interval_select_id = e.detail.value;
    this.changeInterval();
  }

  async changeInterval(){
    await this.loadPeriods(true);
  }

  async loadPeriods(indicator: boolean = false){
    this.progress = (indicator == false ? false : true);

    let object_id = this.reservation_object_select_id;
    let interval_id = this.reservation_interval_select_id;
    let date = this.date;
    let node_name = 'periods_public';

    if(this.apiCtrl.isLogin()){
      node_name = 'periods';
    }else{
      node_name = 'periods_public';
    }

    let url: string = `/api/reservation/${node_name}?reservation_object=${object_id}&reservation_interval=${interval_id}&period_date=${date}`;

    let response = await this.apiCtrl.getServer(url, false).catch(err => {
      return undefined;
    });

    if(response != undefined && response?.['message'] == 'success'){
      this.periods = [];
      response['data']['periods'].map((item:any, index: number) => {
        let period = new PeridObject(item, index+1);
        if(this.apiCtrl.isLogin()){
          period.setOwner(this.apiCtrl.user?.user_id || 0);
        }
        this.periods.push(period);
      });
    }else if(response != undefined){
      this.periods = [];
      if(response?.['message'] == 'object does not work'){
        this.object_does_not_work = true;
      }else if(response?.['message'] == 'old date'){
        this.old_date = true;
      }else if(response?.['message'] == 'out of date'){
        this.out_of_date = true;
      }else{
        this.object_does_not_work = false;
        this.old_date = false;
      }
    }else{
      this.periods = [];
    }

    this.progress = false;
  }

  clickSelectPeriod(item: PeridObject){
    if(!this.progress){

      console.log(item);

      this.router.navigateByUrl('/tabs/orders/reservation');
    }
  }





}
