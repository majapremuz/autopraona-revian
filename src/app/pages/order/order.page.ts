/**
 status:
 1 - na čekanju
 2 - odobreno
 3 - zauzeto
 4 - odbačeno
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationService } from 'src/app/services/reservations.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';

interface ReservationResponse {
  status_code: number;
  status: boolean;
  message: string;
  data: any;
  signature: string;
  timestamp: number;
}


@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  selectedDateTime: string = '';
  selectedDate: string = '';
  selectedTime: string = '';
  currentUser: any = null;
  savedCar: any = null;
  savedCars: any[] = [];
  selectedCar: any = null;
  reservationObjects: any[] = [];
  usluge: any[] = [];
  intervali: any[] = [];      
  selectedIntervalId: any = '';
  selectedDuration: any = '';


  // form fields
  objekt: string = '';
  kategorija: string = '';
  usluga: string = '';
  ime: string = '';
  prezime: string = '';
  imeVozila: string = '';
  modelVozila: string = '';
  registracija: string = '';


  constructor(
    private router: Router,
    private reservationService: ReservationService,
    private http: HttpClient,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  const date = this.reservationService.getDate();
  const time = this.reservationService.getTime();

  console.log('Loaded from ReservationService:', { date, time });

  if (date && time) {
    this.selectedDate = date;
    this.selectedTime = time;
    this.selectedDateTime = `${date} u ${time}`;
  }

  // load user
  const user = localStorage.getItem('currentUser');
  if (user) {
    this.currentUser = JSON.parse(user);
    if (this.currentUser.cars && this.currentUser.cars.length > 0) {
      this.savedCars = this.currentUser.cars;
      this.selectedCar = this.savedCars[0];
      this.updateCarFields(this.selectedCar);
    }
  }
  this.loadReservationObjects();
  this.loadReservationIntervals()
}

loadReservationObjects() {
  const url = `${environment.rest_server.protokol}${environment.rest_server.host}${environment.rest_server.functions.api}/reservation/reservation_objects_public`;

  this.http.get<any>(url, {
    params: { company_id: '17' }
  }).subscribe({
    next: (res) => {
      console.log('Reservation objects:', res);
      this.reservationObjects = res?.data?.data || [];
    },
    error: (err) => {
      console.error('Failed to load reservation objects', err);
    }
  });
}

loadReservationIntervals() {
  const url = `${environment.rest_server.protokol}${environment.rest_server.host}${environment.rest_server.functions.api}/reservation/reservation_intervals_public`;

  this.http.get<any>(url, {
    params: { 
      company_id: '17', 
      reservation_object: '4'
    }
  }).subscribe({
    next: (res) => {
      console.log('Reservation intervals full response:', res);
      const intervalsArray = res?.data?.data || []; 
      console.log('Extracted intervals:', intervalsArray);
      this.intervali = intervalsArray;
    },
    error: (err) => {
      console.error('Failed to load reservation intervals', err);
    }
  });
}

onCarChange(event: any) {
  const car = this.savedCars.find(c => c.registracija === event.detail.value);
  if (car) {
    this.selectedCar = car;
    this.updateCarFields(car);
  }
}

onObjektChange(event: any) {
  const objektId = event.detail.value;
  this.objekt = objektId;
  this.loadReservationIntervals();
}

updateCarFields(car: any) {
  this.imeVozila = car.ime;
  this.modelVozila = car.model;
  this.registracija = car.registracija;
}

  placeOrder(form?: any) {
  if (form && !form.valid) {
    this.showToast('Molimo ispunite sva obavezna polja!', 'warning');
    return;
  }

  const body = {
    date: `${this.selectedDate}T${this.selectedTime}`,
    period: this.selectedTime,
    interval: this.selectedIntervalId,
    object: this.objekt,
    name: `Rezervacija za ${this.ime} ${this.prezime}`,
    description: `Rezervacija vozila ${this.imeVozila} ${this.modelVozila} (${this.registracija})`
  };

  console.log('Body:', body);

  console.log('Sending reservation:', body);

  const url = `${environment.rest_server.protokol}${environment.rest_server.host}${environment.rest_server.functions.api}/reservation/reservation`;

  this.http.post<ReservationResponse>(url, body).subscribe({
    next: (res) => {
      console.log('Reservation success', res);
      if (res.status) {
        this.showToast('Rezervacija uspješno napravljena!', 'success');
        this.router.navigate(['/home']);
      } else {
        this.showToast('Rezervacija nije prošla. Provjerite podatke.', 'warning');
      }
    },
    error: (err) => {
      console.error('Reservation error', err);
      this.showToast('Dogodila se greška prilikom rezervacije.', 'error');
    },
  });
}

async showToast(message: string, type: 'success' | 'warning' | 'error' = 'success') {
  let color: string;

  switch (type) {
    case 'success':
      color = 'success';
      break;
    case 'warning':
      color = 'warning'; 
      break;
    case 'error':
      color = 'danger'; 
      break;
    default:
      color = 'primary';
  }

  const toast = await this.toastController.create({
    message,
    duration: 3000,
    color,
    position: 'bottom'
  });
  await toast.present();
}

  addCar() {
    this.router.navigate(['/add-car']);
  }

  cancel() {
    this.router.navigate(['/home']);
  }

}
