import { environment } from "src/environments/environment"

export interface UserApiInterface {
    user_id: number
    user_access_permission: number
    user_firstname: string
    user_lastname: string
    user_email: string
    user_phone: string
    user_address: string
    user_city: string
    user_zip: any
    user_country: any
    user_note: string
    user_timezone: any
    user_language: any
    user_expire: string
    user_date: string
    user_email_change_date: any
    user_verify: string
    user_ban: string
    user_active_company: number
    user_display_name: any
    user_display_title: any
    user_display_text: any
    user_display_image: any
    user_display_mobile: any
    user_display_phone: any
    user_display_email: any
    user_display_attachment_key: any
    user_app: string
}

interface ImageApiInterface {
    attachment_id: number
    attachment_key_id: number
    attachment_attachment_id: number
    attachment_uid: number
    attachment_create: string
    multimedia_id: number
    multimedia_type: number
    multimedia_owner: number
    multimedia_name: any
    multimedia_description: any
    multimedia_file: string
    multimedia_file_old: string
    multimedia_thumbnail: any
    multimedia_thumbnail2x: any
    multimedia_mime: string
    multimedia_access_permission: any
}

export interface CompanyApiInterface {
    company_id: number
    company_name: string
    company_oib: any
    company_email: string
    company_phone: string
    company_address: any
    company_city: any
    company_zip: any
    company_country: any
    company_coordinates: string
    company_logo: number
    company_note: string
    company_send_content_notification: string
    company_logo_obj: Array<ImageApiInterface>
}

interface UserInterface {
    user_id: number
    user_access_permission: number
    user_firstname: string
    user_lastname: string
    user_display_name: string
    user_email: string
    user_phone: string
    user_address: string
    user_city: string
    user_zip: any
    user_country: any
    user_note: string
    user_timezone: any
    user_language: any
    user_expire: string
    user_date: string
    user_email_change_date: any
    user_verify: string
    user_ban: string
    user_active_company: number
    user_display_web_name: any
    user_display_title: any
    user_display_text: any
    user_display_image: any
    user_display_mobile: any
    user_display_phone: any
    user_display_email: any
    user_display_attachment_key: any
    user_app: string
}

interface ImageInterface {
    multimedia_id: number
    multimedia_type: number
    multimedia_name: any
    multimedia_description: any
    multimedia_file: string
    multimedia_file_old: string
    multimedia_thumbnail: any
    multimedia_thumbnail2x: any
    multimedia_mime: string
    multimedia_access_permission: any
    full_url_thumbnail2x: string
    full_url: string
    image: boolean
    display_name: string
}

interface CompanyInterface {
    company_id: number
    company_name: string
    company_display_name?:string
    company_oib: any
    company_email: string
    company_phone: string
    company_address: any
    company_display_address: string
    company_city: any
    company_zip: any
    company_country: any
    company_coordinates: GeoPointObject
    company_has_coordinates: boolean
    company_note: string
    company_send_content_notification: string
    company_image: ImageObject | null
    company_has_image: boolean
}


enum MultimediaMime {
    png  = 'image/png',
    jpg  = 'image/jpg',
    jpeg = 'image/jpeg',
    gif  = 'image/gif'
}

interface GeoPoint {
    lat: number,
    lng: number 
}

export class UserObject implements UserInterface{
    user_id: number
    user_access_permission: number
    user_firstname: string
    user_lastname: string
    user_display_name: string
    user_email: string
    user_phone: string
    user_address: string
    user_city: string
    user_zip: any
    user_country: any
    user_note: string
    user_timezone: any
    user_language: any
    user_expire: string
    user_date: string
    user_email_change_date: any
    user_verify: string
    user_ban: string
    user_active_company: number
    user_display_web_name: any
    user_display_title: any
    user_display_text: any
    user_display_image: any
    user_display_mobile: any
    user_display_phone: any
    user_display_email: any
    user_display_attachment_key: any
    user_app: string

    constructor(data: UserApiInterface){
        this.user_id = data.user_id;
        this.user_access_permission = data.user_access_permission;
        this.user_firstname = data.user_firstname;
        this.user_lastname = data.user_lastname;
        this.user_display_name = `${this.user_firstname} ${this.user_lastname} [${this.user_id}]`;
        this.user_email = data.user_email;
        this.user_phone = data.user_phone;
        this.user_address = data.user_address;
        this.user_city = data.user_city;
        this.user_zip = data.user_zip;
        this.user_country = data.user_country;
        this.user_note = data.user_note;
        this.user_timezone = data.user_timezone;
        this.user_language = data.user_language;
        this.user_expire = data.user_expire;
        this.user_date = data.user_date;
        this.user_email_change_date = data.user_email_change_date;
        this.user_verify = data.user_verify;
        this.user_ban = data.user_ban;
        this.user_active_company = data.user_active_company;
        this.user_display_web_name = data.user_display_name;
        this.user_display_title = data.user_display_title;
        this.user_display_text = data.user_display_text;
        this.user_display_image = data.user_display_image;
        this.user_display_mobile = data.user_display_mobile;
        this.user_display_phone = data.user_display_phone;
        this.user_display_email = data.user_display_email;
        this.user_display_attachment_key = data.user_display_attachment_key;
        this.user_app = data.user_app;
    }
}

export class GeoPointObject implements GeoPoint{
    lat: number
    lng: number 

    constructor(data: string){
        let split = data.split(",");
        let lat = split[0].trim();
        let lng = split[1].trim();

        this.lat = parseFloat(lat);
        this.lng = parseFloat(lng);
    }
}

export class CompanyObject implements CompanyInterface{
    company_id: number
    company_name: string
    company_oib: any
    company_email: string
    company_phone: string
    company_address: any
    company_city: any
    company_zip: any
    company_country: any
    company_coordinates!: GeoPointObject
    company_note: string
    company_send_content_notification: string
    company_image: ImageObject | null
    company_has_image: boolean
    company_display_address: string
    company_has_coordinates: boolean
    company_display_name?: string

    constructor(data: CompanyApiInterface){
        this.company_id = data.company_id;
        this.company_name = data.company_name;
        this.company_oib = data.company_oib;
        this.company_email = data.company_email;
        this.company_phone = data.company_phone;
        this.company_address = data.company_address;
        this.company_city = data.company_city;
        this.company_zip = data.company_zip;
        this.company_country = data.company_country;
        this.company_note = data.company_note;
        this.company_send_content_notification = data.company_send_content_notification;
        this.company_has_image = false;
        this.company_image = null;
        this.company_display_address = '';
        this.company_has_coordinates = false;

        this.company_display_name = `${this.company_name} [${this.company_id}]`;

        if(data.company_logo_obj != null){
            let image = new ImageObject(data.company_logo_obj[0]);
            this.company_has_image = true;
            this.company_image = image;
        }

        if(data.company_coordinates != null){
            let point = new GeoPointObject(data.company_coordinates);
            this.company_coordinates = point;
            this.company_has_coordinates = true;
        }

        this.createDisplayAddress();


    }

    createDisplayAddress(){
        this.company_display_address = this.company_address + ', ' + this.company_zip + ' ' + this.company_city;
    }
}


export class ImageObject implements ImageInterface{
    multimedia_id: number
    multimedia_type: number
    multimedia_name: any
    multimedia_description: any
    multimedia_file: string
    multimedia_file_old: string
    multimedia_thumbnail: any
    multimedia_thumbnail2x: any
    multimedia_mime: string
    multimedia_access_permission: any
    full_url_thumbnail2x!: string
    full_url!: string
    image!: boolean
    display_name!: string

    doc_icon: string = 'assets/imgs/document.png';

    constructor(data: ImageApiInterface){
        this.multimedia_id = data.multimedia_id;
        this.multimedia_type = data.multimedia_type;
        this.multimedia_name = data.multimedia_name;
        this.multimedia_description = data.multimedia_description;
        this.multimedia_file = data.multimedia_file;
        this.multimedia_file_old = data.multimedia_file_old;
        this.multimedia_thumbnail = data.multimedia_thumbnail;
        this.multimedia_thumbnail2x = data.multimedia_thumbnail2x;
        this.multimedia_mime = data.multimedia_mime;
        this.multimedia_access_permission = data.multimedia_access_permission;

        this.getPath();
        this.getName();

    }

    getName(){
        if(this.multimedia_file_old == null || this.multimedia_file_old == ''){
            this.display_name = this.multimedia_file;
        }else{
            this.display_name = this.multimedia_file_old
        }
    }

    getPath(){
        if(this.multimedia_mime == MultimediaMime.png || this.multimedia_mime == MultimediaMime.jpg || this.multimedia_mime == MultimediaMime.jpeg || this.multimedia_mime == MultimediaMime.gif){
            this.full_url = environment.rest_server.protokol + environment.rest_server.host + environment.rest_server.multimedia + '/original/' + this.multimedia_file;

            this.full_url_thumbnail2x = environment.rest_server.protokol + environment.rest_server.host + environment.rest_server.multimedia + '/thumbnail2x/' + this.multimedia_file;

            this.image = true;
          }
          else{
            this.full_url = environment.rest_server.protokol + environment.rest_server.host + environment.rest_server.multimedia + '/' + this.multimedia_file;
            this.image = false;
          }
    }
}