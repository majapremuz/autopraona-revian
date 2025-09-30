import { Injectable } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/hr';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  date: moment.Moment = moment();
  
  constructor() {}

  setToday(){
    this.date = moment();
  }

  getMinDate(){
    let date = moment();
    return date.format('YYYY-MM-DD');
  }

  checkOldDate(date: string, from = 'YYYY-MM-DD'){
    let date_mom = moment(date, from);
    let today = moment();

    if(date_mom < today){
      return true;
    }else{
      return false;
    }
  }

  setDate(date: string, from = 'YYYY-MM-DD'){
    this.date = moment(date, from);
  }

  parseDate(date: string){
    let date_mom =  moment(date);
    return date_mom.format('YYYY-MM-DD');
  }

  addDay(){
    this.date = this.date.add(1, 'days');
  }

  subDay(){
    this.date = this.date.subtract(1, 'days');
  }

  getDay(long: boolean = false){
    return this.date.format(long ? 'dddd' : 'DD');
  }

  getMonth(long: boolean = false){
    return this.date.format(long ? 'MMMM' : 'MM');
  }

  getYear(){
    return this.date.format('YYYY');
  }


}
