import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.page.html',
  styleUrls: ['./add-car.page.scss'],
})
export class AddCarPage implements OnInit {
  imeVozilaValue: string = '';
  modelVozilaValue: string = '';
  registracijaValue: string = '';

  constructor(
    private router: Router, 
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  async saveCar() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser) return;

    const newCar = {
      ime: this.imeVozilaValue,
      model: this.modelVozilaValue,
      registracija: this.registracijaValue,
    };

    if (!currentUser.cars) {
      currentUser.cars = [];
    }

    currentUser.cars.push(newCar);

    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) =>
      u.email === currentUser.email ? currentUser : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    const toast = await this.toastController.create({
      message: 'Vozilo je spremljeno!',
      duration: 2000,
      color: 'success',
      position: 'bottom',
    });
    await toast.present();

    window.history.back();
  }

  backToProfil(){
    window.history.back();
  }


}
