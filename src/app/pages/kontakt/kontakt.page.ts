import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kontakt',
  templateUrl: './kontakt.page.html',
  styleUrls: ['./kontakt.page.scss'],
})
export class KontaktPage implements OnInit {
  currentPage: string = 'kontakt';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  sendEmail() {
    const email = 'info@revian.hr';
    window.location.href = `mailto:${email}`;
  }

  callPhoneNumber() {
    const phoneNumber = '+385 95 39 93 730';
    window.location.href = `tel:${phoneNumber}`;  
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
