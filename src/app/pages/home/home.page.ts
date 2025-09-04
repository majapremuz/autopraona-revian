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

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
})
export class HomePage {
  currentPage: string = 'home';

  selectedDate: string = '';
  formattedDate: string = '';
  selectedTime: string = '';
  applyForm= new FormGroup ({
    date: new FormControl("", Validators.required),
    time: new FormControl('', Validators.required)
  })

  translate: any = [];

  contents: Array<ContentObject> = [];

  constructor(
    private dataCtrl: ControllerService,
    private http: HttpClient,
    private router: Router
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


  ionViewWillEnter(){
    this.dataCtrl.setHomePage(true);
  }

  ionViewWillLeave(){
    this.dataCtrl.setHomePage(false);
  }

  availableTimes: string[] = [
    '08:00', '08:45', '09:30', '10:15',
    '11:00', '11:45', '12:30', '13:15',
    '14:00', '14:45'
  ];

  checkAvailability(time: string) {
  const payload = {
    date: this.applyForm.value.date,
    time: time
  };

  // Call your API to check availability
  this.http.post<{ available: boolean }>('http://localhost:3000/check-time', payload)
    .subscribe({
      next: (res) => {
        if (res.available) {
          // ✅ Highlight slot
          this.selectedTime = time;
          this.applyForm.patchValue({ time: time });
        } else {
          // ❌ Redirect if unavailable
          this.router.navigate(['/date-rezerved']);
        }
      },
      error: (err) => {
        console.error('API error:', err);
      }
    });
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

  onDateChange(event: any, type: string) {
    const selectedDate = event.detail.value;
    const date = new Date(selectedDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;

    if (type === 'date') {
      this.selectedDate = selectedDate;
      this.formattedDate = formattedDate;
      this.applyForm.patchValue({ date: formattedDate });
    } 
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
