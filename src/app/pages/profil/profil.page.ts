import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  currentPage: string = 'profil';
  isLoggedIn: boolean = false;
  currentUser: any = null;

  constructor(private router: Router) { }

  ngOnInit() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.isLoggedIn = true;
      this.currentUser = JSON.parse(user);
    }
  }

  ionViewWillEnter() {
    this.loadUser();
  }

  loadUser() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.isLoggedIn = true;
      this.currentUser = JSON.parse(user);
    } else {
      this.isLoggedIn = false;
      this.currentUser = null;
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
    this.currentUser = null;
    this.router.navigate(['/home']);
  }

  async deleteProfile() {
  const alert = document.createElement('ion-alert');
  alert.header = 'Potvrda';
  alert.message = 'Jeste li sigurni da želite izbrisati profil?';
  alert.buttons = [
    {
      text: 'Odustani',
      role: 'cancel'
    },
    {
      text: 'Izbriši',
      handler: () => {
        // remove current user
        localStorage.removeItem('currentUser');
        
        // optionally remove from all users if you have a list
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.filter((u: any) => u.email !== this.currentUser.email);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        this.isLoggedIn = false;
        this.currentUser = null;

        this.router.navigate(['/profil']);
      }
    }
  ];

  document.body.appendChild(alert);
  await alert.present();
}


  edit() {
    this.router.navigate(['/edit']);
  }

  addCar() {
    this.router.navigate(['/add-car']);
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
