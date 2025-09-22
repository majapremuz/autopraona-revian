import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  ime: string = '';
  prezime: string = '';
  telefon: string = '';
  email: string = '';

  constructor(
    private router: Router, 
    private authService: AuthService
  ) { }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.ime = user.ime || '';
      this.prezime = user.prezime || '';
      this.telefon = user.telefon || '';
    }
  }

    saveChanges() {
    this.authService.updateUser({
      ime: this.ime,
      prezime: this.prezime,
      telefon: this.telefon
    }).then(() => {
      alert('Podaci uspješno ažurirani!');
      this.router.navigate(['/profil']);
    }).catch(err => {
      alert(err);
    });
  }

  backToProfil(){
    window.history.back();
  }

}
