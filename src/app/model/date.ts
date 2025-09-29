import * as moment from 'moment';
import 'moment/locale/hr';


export class DateService {

    setLocalization(lng = 'hr'){
        moment.locale(lng);
    }

    /*** NEW WAY ***/
  
    /**
      * 
      * odabrati tip ili ako je tip neki vanredni onda ga definirati pomocu input_string
      *
      * utc ako je TRUE onda to znaci da je datum koji je input definiran kao utc i onda mu se pridodaje +00:00
      *
      * slanjem date = '' funkcija ce vratiti trenutno vrijeme
      *
      */
    createMoment(date: string, type: 'date'|'dateTime', utc = true, input_string = null){
      let string: string = '';
      if(input_string != null){
        string = input_string;
      }else{
        if(type == 'date'){
          string = 'YYYY-MM-DD'; // ISO date
        }else{
          string = 'YYYY-MM-DDTHH:mm:ss'; // ISO datetime
        }
      }
  
      let date_mom;
      if(date == ''){
        date_mom = moment();
      }else{
        date_mom = moment(date, string).utc(utc);
      }
      return date_mom;
    }
  
  
    getString(date_mom: any, type: 'date'|'dateTime'|'time'|'timeSeconds' = 'dateTime', input_string = null){
      let string: string = '';
      if(input_string != null){
        string = input_string;
      }else{
        if(type == 'date'){
          string = 'DD.MM.YYYY.'; 
        }
        else if(type == 'dateTime'){
          string = 'DD.MM.YYYY. HH:mm';
        }
        else if(type == 'time'){
          string = 'HH:mm';
        }
        else if(type == 'timeSeconds'){
          string = 'HH:mm:ss';
        }
      }
      return date_mom.local().format(string);
    }
  
    getISOString(date_mom: any, type: 'date'|'dateTime', input_string = null){
      let string: string = '';
      if(input_string != null){
        string = input_string;
      }else{
        if(type == 'date'){
          string = 'YYYY-MM-DD'; // ISO date
        }else{
          string = 'YYYY-MM-DDTHH:mm:ss'; // ISO datetime
        }
      }
      return date_mom.format(string);
    }
  
    getFromNow(moment: any){
      return moment.fromNow();
    }
  
  
  
    /*** NEW WAY ***/



    convertISODateToFrontendDate(date: string, from = 'YYYY-MM-DD'){
      let date_mom = moment(date, from);
      return date_mom.format('DD.MM.YYYY.');

    }

    convertTimeToISOstring(date: string, from = 'DD.MM.YYYY. HH:mm'){
        let date_mom = moment(date, from);
        return date_mom.format('YYYY-MM-DDTHH:mm:ss');
    
    }

    convertISODateTimeToFrontendDate(date: string, utc = true){
        if(utc){
          date = date + '+00:00';
        }
        let date_mom = moment(date);
        return date_mom.format('DD.MM.YYYY.');
    }

    convertISODateTimeToFrontendOnlyTime(date: string, utc = true){
      if(utc){
        date = date + '+00:00';
      }
      let date_mom = moment(date);
      return date_mom.format('HH:mm');
    }

    convertISODateTimeToFrontendDateTime(date: string, utc = true){
        if(utc){
          date = date + '+00:00';
        }
        let date_mom = moment(date);
        return date_mom.format('DD.MM.YYYY. HH:mm');
      }

    compareDatesBigger(A: string, B: string){
        let dateA = moment(A);
        let dateB = moment(B);
    
        if(dateA > dateB){
          return true;
        }
        else{
          return false;
        }
    }

    createNow(){
      return moment();
    }

    convertMomentToString(date: any){
      return date.format('YYYY-MM-DDTHH:mm:ss');
    }
    
    compareDatesSmaller(A: string, B: string){
        let dateA = moment(A);
        let dateB = moment(B);

        if(dateA < dateB){
            return true;
        }
        else{
            return false;
        }
    }

    dateFromNow(date: string){
      let date_mom = moment(date);
      return date_mom.fromNow();
    }

    minutesFromNow(date: string){
      let date_mom = moment(date);
      let duration = moment.duration(moment().diff(date_mom));
      return duration.asMinutes();
    }

}