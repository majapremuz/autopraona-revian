import { Component, OnInit } from '@angular/core';
import { PriceGroupObject } from 'src/app/model/reservation_model';
import { PriceService } from 'src/app/services/price.service';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.page.html',
  styleUrls: ['./price-list.page.scss'],
  standalone: false
})
export class PriceListPage implements OnInit {

  back_str: string = '/tabs/price-list';

  loadData: boolean = false;

  prices: Array<PriceGroupObject> = [];

  constructor(
    private priceCtrl: PriceService
  ) { }

  async ngOnInit() {
    await this.reload();

    this.priceCtrl.newData.subscribe(item => {
      if(item == true){
        this.reload();
      }
    });
  }

  async reload(){
    this.loadData = false;

    this.prices = await this.priceCtrl.getAllPrices();

    this.loadData = true;
  }

}
