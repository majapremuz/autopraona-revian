import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from 'src/app/services/reservations.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-order-chemical',
  templateUrl: './order-chemical.page.html',
  styleUrls: ['./order-chemical.page.scss'],
})
export class OrderChemicalPage implements OnInit {
  isLoggedIn: boolean = false;
  currentUser: any = null;

  selectedDate: string = '';
  formattedDate: string = '';
  selectedTime: string = '';
  savedCar: any = null;
  savedCars: any[] = [];
  selectedCar: any = null;
  reservationsMap: { [time: string]: boolean } = {};
  translate: any = []

  // form fields
  imeVozila: string = '';
  modelVozila: string = ''
  registracija: string = '';

  applyForm= new FormGroup ({
    date: new FormControl("", Validators.required),
    time: new FormControl('', Validators.required),
    imeVozila: new FormControl('', Validators.required),
    modelVozila: new FormControl('', Validators.required),
    registracija: new FormControl('', Validators.required),
  })

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private reservationService: ReservationService,
    private http: HttpClient,
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
  this.isLoggedIn = this.authService.isLoggedIn();
  if (this.isLoggedIn) {
    this.loadUser();const user = localStorage.getItem('currentUser');
  if (user) {
    this.currentUser = JSON.parse(user);
    if (this.currentUser.cars && this.currentUser.cars.length > 0) {
      this.savedCars = this.currentUser.cars;
      this.selectedCar = this.savedCars[0];
      this.updateCarFields(this.selectedCar);
    }
   }
  }

  const today = new Date().toISOString().split('T')[0];
  this.formattedDate = today;
  this.applyForm.patchValue({ date: today });
}


  ionViewWillEnter() {
  if (!this.authService.isLoggedIn()) {
    this.router.navigate(['/login']);
  } else {
    this.loadUser();
  }
}


  loadUser() {
  const user = localStorage.getItem('currentUser');
  if (user) {
    this.currentUser = JSON.parse(user);
    this.isLoggedIn = true;
  } else {
    this.isLoggedIn = false;
  }
}


onDateChange(event: any, controlName: string) {
  const picked = event.detail.value;
  this.formattedDate = picked.split('T')[0];
  this.applyForm.patchValue({ [controlName]: this.formattedDate });

  this.reservationService.setDate(this.formattedDate);
}

highlightedDates = [
    {
      date: '2023-01-05',
      textColor: '#800080',
      backgroundColor: '#ffc0cb',
    },
    {
      date: '2023-01-10',
      textColor: '#09721b',
      backgroundColor: '#c8e5d0',
    },
    {
      date: '2023-01-20',
      textColor: 'var(--ion-color-secondary-contrast)',
      backgroundColor: 'var(--ion-color-secondary)',
    },
    {
      date: '2023-01-23',
      textColor: 'rgb(68, 10, 184)',
      backgroundColor: 'rgb(211, 200, 229)',
    },
  ];

  get displayTime() {
  if (!this.selectedTime) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  const date = new Date(this.selectedTime);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

get currentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

  onTimeChange(event: any) {
  this.selectedTime = event.detail.value;
  console.log('Selected time:', this.selectedTime);
}

onCarChange(event: any) {
  const car = this.savedCars.find(c => c.registracija === event.detail.value);
  if (car) {
    this.selectedCar = car;
    this.updateCarFields(car);
  }
}

updateCarFields(car: any) {
  this.imeVozila = car.ime;
  this.modelVozila = car.model;
  this.registracija = car.registracija;
}

addCar() {
    this.router.navigate(['/add-car']);
  }

cancel() {
  this.router.navigate(['/home']);
}

}
