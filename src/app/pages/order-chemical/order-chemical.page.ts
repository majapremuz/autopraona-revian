import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from 'src/app/services/reservations.service';
import { environment } from 'src/environments/environment';

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
  reservationsMap: { [time: string]: boolean } = {};
  translate: any = []

  applyForm= new FormGroup ({
    date: new FormControl("", Validators.required),
    time: new FormControl('', Validators.required)
  })

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private reservationService: ReservationService,
    private http: HttpClient
  ) { }

  ngOnInit() {
  this.isLoggedIn = this.authService.isLoggedIn();
  if (this.isLoggedIn) {
    this.loadUser();
  }
}

  ionViewWillEnter() {
  if (!this.authService.isLoggedIn()) {
    this.router.navigate(['/login']);
  } else {
    this.loadUser();
  }
}

availableTimes: string[] = [
    '08:00', '08:45', '09:30', '10:15',
    '11:00', '11:45', '12:30', '13:15',
    '14:00', '14:45'
  ];

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
  this.loadReservations(this.formattedDate);
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
      console.log('API response for date', date, res);

      this.reservationsMap = {};

      // Defensive: navigate safely
      const reservations = res?.data?.data ?? [];

      // Get reserved times (format "HH:mm") for this date
      const reservedTimes = reservations
        .filter((r: any) => r.reservation_date_start.startsWith(date))
        .map((r: any) => r.reservation_date_start.slice(11, 16));

      // Fill map: false = reserved (red), true = available (green)
      this.availableTimes.forEach(time => {
        this.reservationsMap[time] = !reservedTimes.includes(time);
      });

      console.log('Reservations map:', this.reservationsMap);
    },
    error: (err) => console.error('API error:', err)
  });
}

}
