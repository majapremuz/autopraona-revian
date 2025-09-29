import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ControllerService } from 'src/app/services/controller.service';

interface AssociativeArray {
  [key: string]: string;
}

export interface DataPickerStructure {
  id: string | number,
  title: string,
  subTitle?: string,
  thumbnailUrl?: string,
  class?: 'tab_1' | 'tab_2' | 'tab_3' | '',
  icon?: string,
  hasIcon?: boolean,
  disable?: boolean,
  select?: boolean
}

export interface DataPickerMapping {
  id: 'id' | 'title' | 'subTitle' | 'thumbnailUrl' | 'class' | 'icon' | 'hasIcon' | 'disable' | 'select',
  chain: string,
}

export interface DataPickerOptions {
  pageTitle?: string,
  selectType: 'single' | 'multi',
  showThumbnail?: boolean,
  dataType: 'remote' | 'local',
  selectData: Array<number | string>,
  data?: Array<DataPickerStructure>,
  dataUrl?: string,
  allowCancel?: boolean,
  dataModel?: any,
  dataMapping?: Array<DataPickerMapping>
}

class DataMapper implements DataPickerStructure{
  id: string | number;
  title: string;
  subTitle?: string;
  thumbnailUrl?: string;
  class?: 'tab_1' | 'tab_2' | 'tab_3' | '';
  icon?: string;
  hasIcon?: boolean;
  disable?: boolean;
  select?: boolean;

  constructor(data: any){
    this.id = data.id;
    this.title = data.title;
    this.subTitle = data?.subtitle || '';
    this.thumbnailUrl = data?.thumbnailUrl || '';
    this.class = data?.class || '';
    this.icon = data?.icon || '';
    this.hasIcon = data?.hasIcon || false;
    this.disable = data?.disable || false;
    this.select = data?.select || false;
  }
}

// TODO add page support

@Component({
  selector: 'app-data-picker',
  templateUrl: './data-picker.page.html',
  styleUrls: ['./data-picker.page.scss'],
  standalone: false
})

export class DataPickerPage implements OnInit {

  @Input() options!: DataPickerOptions;

  translateWords: AssociativeArray = {};

  singleSelectId: string = '';
  singleSelectId_old: string = '';

  multiSelectIds_old: Array<string> = [];

  emptyImage: string = 'assets/img/empty-300x240.jpg';

  pageTitle: string = '';
  allowCancel: boolean = true;
  showThumbnail: boolean = false;
  selectType: 'single' | 'multi' = 'single';
  loadData: boolean = false;
  dataRows: Array<DataPickerStructure> = [];
  selectData: Array<string> = [];

  noData: boolean = false;

  constructor(
    private dataCtrl: ControllerService,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    await this.initTranslate();

    if((this.options?.pageTitle || '') == ''){
      this.pageTitle = 'Odaberi';
    }else{
      this.pageTitle = this.options?.pageTitle || '';
    }

    if(this.options?.allowCancel == undefined){
      this.allowCancel = true;
    }else{
      if(this.options?.allowCancel == true){
        this.allowCancel = true;
      }else{
        this.allowCancel = false;
      }
    }

    if(this.options.selectType == 'single'){
      this.selectType = 'single';
    }else{
      this.selectType = 'multi';
    }

    if(this.options?.showThumbnail == undefined){
      this.showThumbnail = false;
    }else{
      if(this.options?.showThumbnail == true){
        this.showThumbnail = true;
      }else{
        this.showThumbnail = false;
      }
    }

    if(this.options.dataUrl == undefined){
      this.options.dataUrl == '';
    }

    this.options.selectData.map((item) => {
      this.selectData.push(item.toString());
    });

    if(this.options.dataType == 'local' && this.options.dataUrl != ''){
      this.dataRows = this.options.data || [];
      this.dataRows.map(item => {
        this.formattingData(item);
      });

      if(this.dataRows.length > 0){
        this.noData = false;
      }else{
        this.noData = true;
      }

      this.loadData = true;
    }else{
      this.loadDataServer();
    }
  }

  getObjectValByString(obj: any, str: string): any {
    if (typeof obj === "string") return obj;
    if (typeof obj === "number") return obj.toString();

    try{
        const fields = str.split(".");
        return this.getObjectValByString(obj[fields[0]], fields.slice(1).join("."));
    }catch{
        console.log(obj, str);
    }
  }

  mapData(item_input: any): DataPickerStructure{
    let data_tmp: AssociativeArray = {};
    if(this.options?.dataMapping){
      this.options.dataMapping.map(item => {
        data_tmp[item.id] = this.getObjectValByString(item_input, item.chain);
      });
    }

    return new DataMapper(data_tmp);
  }

  selectRadio(id :string){
    this.singleSelectId = id;
  }

  formattingData(item: DataPickerStructure){
    item.id = item.id.toString();

    if(this.selectData.includes(item.id)){
      this.singleSelectId = item.id;
      this.singleSelectId_old = item.id;
      this.multiSelectIds_old.push(item.id);

      item.select = true;
    }else{
      item.select = false;
    }

    if((item?.disable || false) == true){
      item.disable = true;
    }else{
      item.disable = false;
    }

    if((item?.class || '') == ''){
      item.class = '';
    }else{
      item.class = item?.class || '';
    }

    if((item?.thumbnailUrl || '') == ''){
      item.thumbnailUrl = this.emptyImage;
    }else{
      item.thumbnailUrl = item?.thumbnailUrl || '';
    }

    if((item?.subTitle || '') == ''){
      item.subTitle = '';
    }else{
      item.subTitle = item?.subTitle || '';
    }

    if((item?.icon || '') == ''){
      item.icon = '';
      item.hasIcon = false;
    }else{
      item.icon = item?.icon || '';
      item.hasIcon = true;
    }
  }

  async loadDataServer(){
    await this.dataCtrl.showLoader();

    let data = await this.dataCtrl.getServer(this.options?.dataUrl || '', false).catch(err => {
      this.dataCtrl.parseErrorMessage(err).then(message => {
        this.dataCtrl.showToast(message.message, message.type);
          if(message.title == 'server_error'){
            // take some action e.g logout, change page
          }
      });
      return undefined;
    });

    if(data != undefined){
      if(data.data != null){
        this.noData = false;
        data.data.data.map((item: any) => {
          try{
            let item_tmp: any;
            if(this.options?.dataModel){
              item_tmp = new this.options.dataModel(item);
            }else{
              item_tmp = item;
            }
  
            let item_map = this.mapData(item_tmp);
            this.formattingData(item_map);
            this.dataRows.push(item_map);
          }catch(e){
            console.log(e);
          }
        });
      }else{
        this.dataRows = [];
        this.noData = true;
      }

    }

    this.loadData = true;
    await this.dataCtrl.hideLoader();
  }

  toggleColumn($e: any, item: DataPickerStructure){
    item.select = !item.select;
  }

  confirm(){
    let selectedString: Array<any> = [];

    if(this.selectType == 'single'){
      if(this.singleSelectId != ''){
        this.dataRows.map(item => {
          if(item.id == this.singleSelectId){
            selectedString.push(item);
          }
        });
      }
    }
    else{
      this.dataRows.map(item => {
        if(item.select == true){
          selectedString.push(item);
        }
      });
    }

    return this.modalCtrl.dismiss(selectedString, 'confirm');

  }

  cancel(){
    let selectedString: Array<any> = [];
    
    if(this.selectType == 'single'){
      if(this.singleSelectId_old != ''){
        this.dataRows.map(item => {
          if(item.id == this.singleSelectId_old){
            selectedString.push(item);
          }
        });
      }
    }
    else{
      this.dataRows.map(item => {
        if(this.multiSelectIds_old.includes(item.id.toString())){
          item.select = true;
        }else{
          item.select = false;
        }
      })

      this.dataRows.map(item => {
        if(item.select == true){
          selectedString.push(item);
        }
      });
    }

    return this.modalCtrl.dismiss(selectedString, 'cancel');
  }

  async initTranslate(){
    this.translateWords['NO_DATA'] = await this.dataCtrl.translateWord("MESSAGES.NO_DATA");
  }

}
