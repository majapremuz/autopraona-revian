import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContentApiInterface, ContentObject } from 'src/app/model/content';
import { ControllerService } from 'src/app/services/controller.service';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ReservationService } from 'src/app/services/reservations.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
})
export class HomePage {
  currentPage: string = 'home';
  currentUser: any = null;
  isLoggedIn: boolean = false;

  availablePeriods: any[] = [];
  apiMessage: string = '';
  availableTimes: string[] = [];

  selectedDate: string = '';
  formattedDate: string = '';
  selectedTime: string = '';
  reservationsMap: { [time: string]: number | undefined } = {};
  applyForm= new FormGroup ({
    date: new FormControl("", Validators.required),
    time: new FormControl('', Validators.required)
  })

  translate: any = [];

  contents: Array<ContentObject> = [];

  constructor(
    private dataCtrl: ControllerService,
    private http: HttpClient,
    private router: Router,
    private reservationService: ReservationService,
    private authService: AuthService
  ) {
    // set today's date on load
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    this.formattedDate = `${year}-${month}-${day}`;
    this.applyForm.patchValue({ date: this.formattedDate });

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url.includes('home')) {
        this.currentPage = 'home';
      } else if (event.url.includes('cijenik')) {
        this.currentPage = 'cijenik';
      } else if (event.url.includes('vijesti')) {
        this.currentPage = 'vijesti';
      } else if (event.url.includes('kontakt')) {
        this.currentPage = 'kontakt';
      } else if (event.url.includes('profil')) {
        this.currentPage = 'profil';
      }
    });
  }


    ionViewWillEnter() {
  this.dataCtrl.setHomePage(true);
  this.loadPeriods(this.formattedDate);

  if (!this.authService.isLoggedIn()) {
    this.router.navigate(['/login']);
  } else {
    this.loadUser();
    setTimeout(() => this.loadReservations(this.formattedDate), 100);
  }
}

  ionViewWillLeave(){
    this.dataCtrl.setHomePage(false);
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

  checkAvailability(time: string) {
  if (!this.isLoggedIn) {
    this.router.navigate(['/login']);
    return;
  }

  const period = this.availablePeriods.find(p => p.start === time);

  if (period && period.reserved) {
    this.router.navigate(['/date-rezerved']);
    return;
  }

  this.selectedTime = time;
  this.applyForm.patchValue({ time });

  if (!this.reservationService.getDate()) {
    this.reservationService.setDate(this.formattedDate);
  }

  this.reservationService.setTime(time);
  this.router.navigate(['/order']);
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

  loadReservations(date: string = this.formattedDate) {
  const url = `${environment.rest_server.protokol}${environment.rest_server.host}${environment.rest_server.functions.api}/reservation/reservations`;

  this.http.get<any>(url, {
    params: {
      only_my: 'true',
      sort: 'reservation_date_start',
      sort_dir: 'DESC',
      company_id: '17',
      date
    }
  }).subscribe({
    next: (res) => {
      console.log('API response for reservations on', date, res);

      this.reservationsMap = {};

      const reservations = res?.data?.data ?? [];

      // Build map: { "08:00": status, "09:00": status, ... }
      reservations.forEach((r: any) => {
        if (r.reservation_date_start.startsWith(date)) {
          const time = r.reservation_date_start.slice(11, 16); // "HH:mm"
          this.reservationsMap[time] = r.reservation_status; // number now
          console.log(`Mapped reservation at ${time} with status ${r.reservation_status}`);
        }
      });
      console.log('Reservations map with status:', this.reservationsMap);
    },
    error: (err) => console.error('Reservations API error:', err)
  });
}


getStatusColor(status: number): string {
  console.log('Getting color for status:', status);
  switch (status) {
    case 1: return '#488aff'; // na čekanju
    case 2: return '#421413'; // odobreno
    case 3: return '#421413'; // rezervirano
    case 4: return '#ff0000'; // odbijeno
    default: return '#32db64'; // slobodno
  }
}

loadPeriods(date: string = this.formattedDate) {
  const url = `${environment.rest_server.protokol}${environment.rest_server.host}${environment.rest_server.functions.api}/reservation/periods/`;

  this.http.get<any>(url, {
    params: {
      reservation_object: '4',
      reservation_interval: '8',
      period_date: date,
      company_id: '17'
    }
  }).subscribe({
    next: (res) => {
      console.log('Periods API response', res);

      const data = res?.data;
      if (!data) return;

      this.availablePeriods = data.periods || [];
      this.availableTimes = this.availablePeriods.map(p => p.start);
      this.apiMessage = data.message || '';

      console.log('Available periods:', this.availablePeriods);
    },
    error: (err) => console.error('Periods API error:', err)
  });
}

  onDateChange(event: any, controlName: string) {
  const picked = event.detail.value;
  this.formattedDate = picked.split('T')[0];
  this.applyForm.patchValue({ [controlName]: this.formattedDate });

  this.reservationService.setDate(this.formattedDate);
  this.loadPeriods(this.formattedDate);
}

  openPopover(event: Event, popoverId: string) {
    const popover = document.querySelector(`ion-popover[trigger="${popoverId}"]`);
    if (popover) {
      (popover as any).present({
        ev: event
      });
    }
  }

  login() {
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToCijenik() {
    this.router.navigate(['/cijenik']);
  }

  goToVijesti() {
    this.router.navigate(['/vijesti']);
  }

  goToKontakt() {
    this.router.navigate(['/kontakt']);
  }

  goToProfil() {
    this.router.navigate(['/profil']);
  }

}
