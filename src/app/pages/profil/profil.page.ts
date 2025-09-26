import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  currentPage: string = 'profil';
  isLoggedIn: boolean = false;
  currentUser: any = null;

  constructor(
    private authService: AuthService, 
    private router: Router
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


  loadUser() {
  const user = localStorage.getItem('currentUser');
  if (user) {
    this.currentUser = JSON.parse(user);
    this.isLoggedIn = true;
  } else {
    this.isLoggedIn = false;
  }
}


  logout() {
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
    this.currentUser = null;
    this.router.navigate(['/home']);
  }

  deleteProfile() {
  const currentUser = this.authService.getCurrentUser();
  if (!currentUser?.user_id) {
    alert("Nema ID korisnika!");
    return;
  }

  if (confirm("Jeste li sigurni da želite obrisati račun?")) {
    this.authService.deleteUser(currentUser.user_id).then(() => {
      alert("Korisnički račun uspješno obrisan.");
      this.router.navigate(['/home']);
    }).catch(err => {
      alert(err);
    });
  }
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
