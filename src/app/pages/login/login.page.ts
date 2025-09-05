import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  isLogin = true;
  email = '';
  password = '';

  constructor(private router: Router, private toastCtrl: ToastController) {}

  ngOnInit() {}

  toggleMode(mode: 'login' | 'register') {
    this.isLogin = (mode === 'login');
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.showToast('Unesite email i lozinku.');
      return;
    }

    if (this.isLogin) {
      this.login();
    } else {
      this.register();
    }
  }

  register() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const exists = users.find((u: any) => u.email === this.email);

    if (exists) {
      this.showToast('Korisnik već postoji.');
      return;
    }

    users.push({ email: this.email, password: this.password });
    localStorage.setItem('users', JSON.stringify(users));
    this.showToast('Registracija uspješna! Možete se prijaviti.');
    this.isLogin = true; // switch to login mode
  }

  login() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === this.email && u.password === this.password);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.showToast('Prijava uspješna!');
      this.router.navigate(['/home']);
    } else {
      this.showToast('Pogrešan email ili lozinka.');
    }
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}
