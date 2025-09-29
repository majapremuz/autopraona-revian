import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CompanyObject } from 'src/app/model/company';
import { ControllerService } from 'src/app/services/controller.service';
import { GmapsService } from 'src/app/services/gmaps.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
  standalone: false
})
export class CompanyPage implements OnInit {

  @ViewChild('map', {static: true}) mapElementRef: ElementRef | null;


  dataLoad: boolean = false;
  company: CompanyObject | null;

  googleMaps: any;
  map: any;
  mapEl: any;

  pageTitle: string = '';

  constructor(
    private gmaps: GmapsService,
    public dataCtrl: ControllerService,
    private renderer: Renderer2
  ) {
    this.mapElementRef = null;
    this.company = null;
  }

  async ngOnInit() {
    this.pageTitle = await this.dataCtrl.translateWord('COMPANY.TITLE');

    this.loadData();
  }

  callCompany(){
    window.open('tel:' + this.company?.company_phone);
  }

  mailCompany(){
    window.open(`mailto:${this.company?.company_email}`, '_system');
  }

  async loadData(){

    await this.dataCtrl.showLoader();
    let data = await this.dataCtrl.getServer('/api/company/company_offline?id=' + environment.company_id, true, 5 * 60);

    if(data != null){
      this.company = new CompanyObject(data.data[0]);
      this.dataLoad = true;

      if(this.company.company_has_coordinates == true){
        this.initPage(this.company?.company_coordinates?.lat || 0, this.company?.company_coordinates?.lng || 0, 15);
      }

      this.pageTitle = this.company.company_name;
    }

    this.dataCtrl.hideLoader();
  }

  async initPage(lat: number, lng: number, zoom: number){
    if(this.mapEl == undefined){
      await this.loadMap(lat, lng, zoom);
    }
    this.renderer.addClass(this.mapEl, 'visible');
  }

  async loadMap(lat: number, lng: number, zoom: number){
    let latitude = lat;
    let longitude = lng;
    let zoom_float = zoom;

    try{
      let googleMaps: any = await this.gmaps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      this.mapEl = this.mapElementRef?.nativeElement;
      const location = new googleMaps.LatLng(latitude, longitude);
      this.map = new googleMaps.Map(this.mapEl, {
        center: location,
        zoom: zoom_float,
        disableDefaultUI: true
      });

      const marker = new googleMaps.Marker({
        position: location,
        map: this.map
      });
    } catch(e){
      console.log(e);
    }
  }

}
