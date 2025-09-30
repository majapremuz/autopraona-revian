import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from 'src/app/services/reservations.service';
import { PopoverController } from '@ionic/angular';
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
  ime: string = '';
  prezime: string = '';
  imeVozila: string = '';
  modelVozila: string = '';
  registracija: string = '';
  datum: string = '';
  vrijeme: string = ''
  opis: string = '';

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
    private popoverCtrl: PopoverController,
    private toastController: ToastController
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
  if (!this.datum) this.datum = today;
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
  const isoString = event.detail.value;
  this.selectedTime = isoString;
  
  const time = isoString.split('T')[1]?.substring(0, 5); 
  this.vrijeme = time; 

  console.log('Selected time:', this.vrijeme);
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

placeChemicalOrder(form?: any) {
  if (form && !form.valid) {
    this.showToast('Molimo ispunite sva obavezna polja!', 'warning');
    return;
  }

  const body = {
    ime: this.ime,
    prezime: this.prezime,
    imeVozila: this.imeVozila,
    modelVozila: this.modelVozila,
    registracija: this.registracija,
    datum: this.datum,
    vrijeme: this.vrijeme,
    opis: this.opis
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
