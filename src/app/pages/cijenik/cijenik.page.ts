import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-cijenik',
  templateUrl: './cijenik.page.html',
  styleUrls: ['./cijenik.page.scss'],
})
export class CijenikPage implements OnInit {
  currentPage: string = 'cijenik';

  constructor(
    private router: Router
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
