import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cijenik',
  templateUrl: './cijenik.page.html',
  styleUrls: ['./cijenik.page.scss'],
})
export class CijenikPage implements OnInit {
  currentPage: string = 'cijenik';
  groups: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
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

  ngOnInit() {
    this.loadPrizes();
  }

  loadPrizes() {
    const url = `${environment.rest_server.protokol}${environment.rest_server.host}${environment.rest_server.functions.api}/reservation/prices_public`;
  
    this.http.get<any>(url, {
      params: { company_id: '17' }
    }).subscribe({
      next: (res) => {
        console.log('Prizes:', res);
        if (res.status && res.data) {
          this.groups = res.data; 
        }
      },
      error: (err) => {
        console.error('Failed to load prizes', err);
      }
    });
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
