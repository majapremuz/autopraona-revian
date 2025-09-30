import { DateService } from "./date";
import { CompanyApiInterface, CompanyObject, ImageObject, UserApiInterface, UserObject } from "./basic_model";
import { DataHeaderAction } from "./datatable";

let dateService = new DateService();

interface periodsApiInterface {
    title: string
    start: string
    end: string
    start_raw: string
    end_raw: string
    reserved: boolean
    reserved_id: number | null
    reserved_uid: number | null
}

interface WorkingHourApiInterface {
    working_hour_records_id: number
    working_hour_uid: number
    working_hour_company: number
    working_hour_create: string
    working_hour_records_working_hour: number
    working_hour_records_day: number
    working_hour_records_date: any
    working_hour_records_work: string
    working_hour_records_start: string
    working_hour_records_end: string
    working_hour_description: string
    working_hour_company_obj: Array<CompanyApiInterface>
    working_hour_uid_obj: Array<UserApiInterface>
}

export interface ReservationObjectApiInterface {
    reservation_object_id: number
    reservation_object_uid: number
    reservation_object_uid_obj: Array<UserApiInterface>
    reservation_object_company: number
    reservation_object_company_obj: Array<CompanyApiInterface>
    reservation_object_create: string
    reservation_object_name: string
    reservation_object_description: string
    reservation_object_min_interval: number
    reservation_object_limit: number
    reservation_object_image: number
    reservation_object_image_obj: any
    reservation_working_hour_key: number
}

export interface ReservationIntervalApiInterface {
    reservation_interval_id: number
    reservation_interval_uid: number
    reservation_interval_uid_obj: Array<UserApiInterface>
    reservation_interval_company: number
    reservation_interval_company_obj: Array<CompanyApiInterface>
    reservation_interval_create: string
    reservation_interval_reservation_object: number
    reservation_interval_reservation_object_obj: ReservationObjectApiInterface
    reservation_interval_name: string
    reservation_interval_duration: number
    reservation_interval_description: string
    reservation_interval_image: number
    reservation_interval_image_obj: any
}

interface ReservationApiInterface {
    reservation_id: number
    reservation_uid: number
    reservation_uid_obj: Array<UserApiInterface>
    reservation_company: number
    reservation_company_obj: Array<CompanyApiInterface>
    reservation_create: string
    reservation_name: string
    reservation_description: string
    reservation_date_start: string
    reservation_status: number
    reservation_reservation_interval: number
    reservation_reservation_object: number
    reservation_reservation_interval_obj: ReservationIntervalApiInterface
    reservation_reservation_object_obj: ReservationObjectApiInterface
}

interface PriceGroupApiInterface {
  group_id: number
  group_uid: number
  group_company: number
  group_create: string
  group_name: string
  group_deleted: string
  group_archive: string
  prices: Array<PriceApiInterface>
}

interface PriceApiInterface {
  price_id: number
  price_uid: number
  price_company: number
  price_create: string
  price_name: string
  price_value: number
  price_group: number
  price_archive: string
  price_deleted: string
}


interface periodsInterface {
    title: string
    start: string
    end: string
    start_raw: string
    end_raw: string
    reserved: boolean
    reserved_id: number | null
}

export class PriceGroupObject {
    group_id: number
    group_uid: number
    group_company: number
    group_create: string
    group_name: string
    group_deleted: boolean
    group_archive: boolean
    prices: Array<PriceObject>

    constructor(data: PriceGroupApiInterface){
        this.group_id = data.group_id;
        this.group_uid = data.group_uid;
        this.group_company = data.group_company;
        this.group_create = (data.group_create != null ? dateService.convertISODateTimeToFrontendDateTime(data.group_create, false) : '');
        this.group_name = data.group_name;
        this.group_deleted = (data.group_deleted == 'Y' ? true : false); 
        this.group_archive = (data.group_archive == 'Y' ? true : false);
        this.prices = data.prices.map(price => new PriceObject(price));
    }
}

export class PriceObject {
    price_id: number
    price_uid: number
    price_company: number
    price_create: string
    price_create_raw: string
    price_name: string
    price_value: number
    price_group: number
    price_archive: boolean
    price_deleted: boolean

    constructor(data: PriceApiInterface){
        this.price_id = data.price_id;
        this.price_uid = data.price_uid;
        this.price_company = data.price_company;
        this.price_create = (data.price_create != null ? dateService.convertISODateTimeToFrontendDateTime(data.price_create, false) : '');
        this.price_create_raw = data.price_create;
        this.price_name = data.price_name;
        this.price_value = data.price_value / 100;
        this.price_group = data.price_group;
        this.price_archive = (data.price_archive == 'Y' ? true : false);
        this.price_deleted = (data.price_deleted == 'Y' ? true : false);
    }
}

export class PeridObject implements periodsInterface{
    id: number
    title: string
    start: string
    end: string
    start_raw: string
    end_raw: string
    reserved: boolean
    my_period: boolean
    reserved_id: number | null
    reserved_uid: number | null

    constructor(data: periodsApiInterface, id: number){
        this.id = id;
        this.title = data.title;
        this.start = data.start;
        this.end = data.end;
        this.start_raw = data.start_raw;
        this.end_raw = data.end_raw;
        this.reserved = data.reserved;
        this.reserved_id = data.reserved_id;
        this.reserved_uid = data.reserved_uid;
        this.my_period = false;
    }

    setOwner(id: number){
        if(id == this.reserved_id){
            this.my_period = true;
        }else{
            this.my_period = false;
        }
    }
}

export class WorkingHoursObject{
    working_hour_records_id: number
    working_hour_uid: number
    working_hour_company: number
    working_hour_create: string
    working_hour_records_working_hour: number
    working_hour_records_day: number
    working_hour_records_day_name: string
    working_hour_records_date?: string
    working_hour_records_date_raw: string
    working_hour_records_date_display: string
    working_hour_records_work: boolean
    working_hour_records_work_text: string
    working_hour_records_work_class: string
    working_hour_records_start: string
    working_hour_records_end: string
    working_hour_description: string
    working_hour_company_obj?: CompanyObject
    working_hour_uid_obj?: UserObject
    delete_permission?: boolean
    edit_permission?: boolean
    action_buttons: Array<DataHeaderAction> = []

    constructor(data: WorkingHourApiInterface){
        this.working_hour_records_id = data.working_hour_records_id;
        this.working_hour_uid = data.working_hour_uid;
        this.working_hour_company = data.working_hour_company;
        this.working_hour_create = (data.working_hour_create != null ? dateService.convertISODateTimeToFrontendDateTime(data.working_hour_create, false) : '');
        this.working_hour_records_working_hour = data.working_hour_records_working_hour;
        this.working_hour_records_day = data.working_hour_records_day;
        this.working_hour_records_start = (data.working_hour_records_start != null ? dateService.convertISODateTimeToFrontendOnlyTime(data.working_hour_records_start, false) : '');
        this.working_hour_records_end = (data.working_hour_records_end != null ? dateService.convertISODateTimeToFrontendOnlyTime(data.working_hour_records_end, false) : '');
        this.working_hour_description = data.working_hour_description;
        this.working_hour_records_work_text = '';
        this.working_hour_records_work_class = '';
        this.working_hour_records_date_display = '';
        this.working_hour_records_day_name = '';
        this.working_hour_records_date_raw = data.working_hour_records_date;

        if(data.working_hour_records_date != null){
            this.working_hour_records_date = dateService.convertISODateTimeToFrontendDate(data.working_hour_records_date, false);
            this.working_hour_records_date_display = this.working_hour_records_date;
        }else{
            this.working_hour_records_date_display = this.working_hour_records_day_name;
        }

        if(data.working_hour_records_work == 'Y'){
            this.working_hour_records_work = true;
        }else{
            this.working_hour_records_work = false;
        }

        if(data?.working_hour_uid_obj){
            this.working_hour_uid_obj = new UserObject(data.working_hour_uid_obj[0]);
        }

        if(data?.working_hour_company_obj){
            this.working_hour_company_obj = new CompanyObject(data.working_hour_company_obj[0]);
        }

    }

    setDayName(name: string){
        this.working_hour_records_day_name = name;
        this.working_hour_records_date_display = name;
    }

    setWorkProp(text: string, class_name: string){
        this.working_hour_records_work_text = text;
        this.working_hour_records_work_class = class_name;
    }

    setDeletePermission(state: boolean){
        this.delete_permission = state;
    }

    setEditPermission(state: boolean){
        this.edit_permission = state;
    }

    getUID(){
        return this.working_hour_uid;
    }
}

export class ReservationObject{
    reservation_id: number
    reservation_uid?: number
    reservation_uid_obj?: UserObject
    reservation_company?: number
    reservation_company_obj?: CompanyObject
    reservation_create: string
    reservation_name: string
    reservation_display_name: string
    reservation_description: string
    reservation_date_start: string
    reservation_status: number
    reservation_status_text?: string
    reservation_status_class?: string
    reservation_reservation_interval: number
    reservation_reservation_object: number
    reservation_reservation_interval_obj?: ReservationIntervalObject
    reservation_reservation_object_obj?: ReservationObjectObject
    delete_permission?: boolean
    edit_permission?: boolean
    action_buttons: Array<DataHeaderAction> = []

    constructor(data: ReservationApiInterface){
        this.reservation_id = data.reservation_id;
        this.reservation_create = dateService.convertISODateTimeToFrontendDateTime(data.reservation_create, false);
        this.reservation_name = data.reservation_name;
        this.reservation_description = data.reservation_description;
        this.reservation_date_start = dateService.convertISODateTimeToFrontendDateTime(data.reservation_date_start, false);
        this.reservation_reservation_interval = data.reservation_reservation_interval;
        this.reservation_reservation_object = data.reservation_reservation_object;
        this.reservation_display_name = `${this.reservation_name} [${this.reservation_id}]`;
        this.reservation_status = data.reservation_status;

        if(data?.reservation_reservation_object_obj){
            this.reservation_reservation_object_obj = new ReservationObjectObject(data.reservation_reservation_object_obj);
        }

        if(data?.reservation_reservation_interval_obj){
            this.reservation_reservation_interval_obj = new ReservationIntervalObject(data.reservation_reservation_interval_obj);
        }

        if(data?.reservation_uid_obj && data?.reservation_uid_obj.length > 0){
            this.reservation_uid_obj = new UserObject(data.reservation_uid_obj[0]);
        }

        if(data?.reservation_company_obj){
            this.reservation_company_obj = new CompanyObject(data.reservation_company_obj[0]);
        }

    }

    setStatus(status_tekst: string, status_class: string){
        this.reservation_status_text = status_tekst;
        this.reservation_status_class = status_class;
    }

    setDeletePermission(state: boolean){
        this.delete_permission = state;
    }

    setEditPermission(state: boolean){
        this.edit_permission = state;
    }

    getUID(){
        return this.reservation_uid;
    }

}

export class ReservationIntervalObject{
    reservation_interval_id: number
    reservation_interval_uid?: number
    reservation_interval_uid_obj?: UserObject
    reservation_interval_company?: number
    reservation_interval_company_obj?: CompanyObject
    reservation_interval_create: string
    reservation_interval_reservation_object?: number
    reservation_interval_reservation_object_obj?: ReservationObjectObject
    reservation_interval_name: string
    reservation_interval_display_name: string
    reservation_interval_duration: number
    reservation_interval_description: string
    reservation_interval_image?: number
    reservation_interval_image_obj?: ImageObject
    delete_permission?: boolean
    edit_permission?: boolean
    action_buttons: Array<DataHeaderAction> = []

    constructor(data: ReservationIntervalApiInterface){
        this.reservation_interval_id = data.reservation_interval_id;
        this.reservation_interval_create = dateService.convertISODateTimeToFrontendDateTime(data.reservation_interval_create, false);
        this.reservation_interval_name = data.reservation_interval_name;
        this.reservation_interval_duration = data.reservation_interval_duration;
        this.reservation_interval_description = data.reservation_interval_description;
        this.reservation_interval_display_name = `${this.reservation_interval_name} [${this.reservation_interval_id}]`;

        if(data?.reservation_interval_reservation_object_obj){
            this.reservation_interval_reservation_object_obj = new ReservationObjectObject(data.reservation_interval_reservation_object_obj);
        }

        if(data?.reservation_interval_uid_obj){
            this.reservation_interval_uid_obj = new UserObject(data.reservation_interval_uid_obj[0]);
        }

        if(data?.reservation_interval_company_obj){
            this.reservation_interval_company_obj = new CompanyObject(data.reservation_interval_company_obj[0]);
        }

        if(data?.reservation_interval_image_obj){
            this.reservation_interval_image_obj = new ImageObject(data.reservation_interval_image_obj)
        }

    }

    setDeletePermission(state: boolean){
        this.delete_permission = state;
    }

    setEditPermission(state: boolean){
        this.edit_permission = state;
    }

    getUID(){
        return this.reservation_interval_uid;
    }
}

export class ReservationObjectObject{
    reservation_object_id: number
    reservation_object_uid: number
    reservation_object_uid_obj?: UserObject
    reservation_object_company?: number
    reservation_object_company_obj?: CompanyObject
    reservation_object_create: string
    reservation_object_name: string
    reservation_object_display_name: string
    reservation_object_description: string
    reservation_object_min_interval: number
    reservation_object_limit: number
    reservation_object_image: number
    reservation_object_image_obj: ImageObject | null = null
    reservation_working_hour_key: number
    has_image: boolean
    delete_permission?: boolean
    edit_permission?: boolean
    action_buttons: Array<DataHeaderAction> = []

    constructor(data : ReservationObjectApiInterface){
        this.reservation_object_id = data.reservation_object_id;
        this.reservation_object_uid = data.reservation_object_uid;
        this.reservation_object_create = dateService.convertISODateTimeToFrontendDateTime(data.reservation_object_create, true);
        this.reservation_object_name = data.reservation_object_name;
        this.reservation_object_display_name = `${this.reservation_object_name} [${this.reservation_object_id}]`;
        this.reservation_object_description = data.reservation_object_description;
        this.reservation_object_min_interval = data.reservation_object_min_interval;
        this.reservation_working_hour_key = data.reservation_working_hour_key;
        this.reservation_object_image = data.reservation_object_image;
        this.reservation_object_limit = data.reservation_object_limit;

        if(this.reservation_object_image != null){
            this.has_image = true;
        }else{
            this.has_image = false;
        }

        if(data?.reservation_object_uid_obj){
            this.reservation_object_uid_obj = new UserObject(data.reservation_object_uid_obj[0]);
        }

        if(data?.reservation_object_company_obj){
            this.reservation_object_company_obj = new CompanyObject(data.reservation_object_company_obj[0]);
        }

        if(data?.reservation_object_image_obj){
            if(data.reservation_object_image_obj != null){
                this.reservation_object_image_obj = new ImageObject(data.reservation_object_image_obj)
            }
        }
    }

    setDeletePermission(state: boolean){
        this.delete_permission = state;
    }

    setEditPermission(state: boolean){
        this.edit_permission = state;
    }

    getUID(){
        return this.reservation_object_uid;
    }
}

