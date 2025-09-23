import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.page.html',
  styleUrls: ['./add-car.page.scss'],
})
export class AddCarPage implements OnInit {
  imeVozilaValue: string = '';
  modelVozilaValue: string = '';
  registracijaValue: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  saveCar() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser) return;

    // create new car object
    const newCar = {
      ime: this.imeVozilaValue,
      model: this.modelVozilaValue,
      registracija: this.registracijaValue
    };

    // initialize user's cars array if doesn't exist
    if (!currentUser.cars) {
      currentUser.cars = [];
    }

    currentUser.cars.push(newCar);

    // save back to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // optionally update the users list if you store all users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) =>
      u.email === currentUser.email ? currentUser : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    alert('Vozilo je spremljeno!');
        window.history.back();
  }

  backToProfil(){
    window.history.back();
  }


}
