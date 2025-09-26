import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { AlertType, DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditPage implements OnInit {
  ime: string = '';
  prezime: string = '';
  telefon: string = '';
  email: string = '';

  constructor(
    private router: Router, 
    private authService: AuthService,
    private dataCtrl: DataService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
  const user = this.authService.getCurrentUser();
  if (user) {
    this.ime = user.ime || '';
    this.prezime = user.prezime || '';
    this.telefon = user.telefon || '';
    this.email = user.email || '';
  }
}

async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

    saveChanges() {
  this.authService.updateUser({
    ime: this.ime,
    prezime: this.prezime,
    telefon: this.telefon
  }).then(() => {
    this.dataCtrl.translateWord("Podaci uspješno promjenjeni").then(word => {
          this.dataCtrl.showToast(word, AlertType.Success);
        });
    this.router.navigate(['/profil']);
  }).catch(err => {
    this.dataCtrl.showToast("Nije moguće promjeniti podatke", AlertType.Warning);
  });
}


  backToProfil(){
    window.history.back();
  }

}
