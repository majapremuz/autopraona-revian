import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/services/reservations.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  selectedDateTime: string = '';

  constructor(
    private router: Router,
    private reservationService: ReservationService
  ) { }

  ngOnInit() {
    const date = this.reservationService.getDate();
    const time = this.reservationService.getTime();
    if (date && time) {
      this.selectedDateTime = `${date} u ${time}`;
    }
  }

  cancel() {
    this.router.navigate(['/home']);
  }

}
