import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  isLogin = true;
  emailValue = '';
  passwordValue = '';
  showPassword = false;
  wrongPassword: boolean = false;

  constructor(
    private router: Router, 
    private toastCtrl: ToastController,
    private http: HttpClient,
    private dataCtrl: DataService
  ) {}

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
    if (!this.emailValue || !this.passwordValue) {
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
  const now = Date.now();
  const tokenData = JSON.parse(localStorage.getItem('apiToken') || '{}');
  const tokenValid = tokenData.access_token && tokenData.expiry > now;

  if (tokenValid) {
    // Token exists and is valid
    this.registerWithToken(tokenData.access_token);
  } else {
    // Get a new token first
    this.getToken().then(token => {
      this.registerWithToken(token);
    }).catch(err => {
      console.error('Token error:', err);
      this.showToast('Greška pri dobivanju tokena.');
    });
  }
}

// Get new token from /token.php
private getToken(): Promise<string> {
  const tokenUrl = `${environment.rest_server.protokol}${environment.rest_server.host}${environment.rest_server.functions.token}`;
  
  const body = new URLSearchParams();
  body.set('grant_type', 'client_credentials');
  body.set('client_id', environment.client_id);
  body.set('client_secret', environment.client_password);

  return new Promise((resolve, reject) => {
    this.http.post<any>(tokenUrl, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    }).subscribe({
      next: (res) => {
        const expiry = Date.now() + res.expires_in * 1000; // milliseconds
        localStorage.setItem('apiToken', JSON.stringify({ access_token: res.access_token, expiry }));
        resolve(res.access_token);
      },
      error: (err) => reject(err)
    });
  });
}

// Register using the token
private registerWithToken(token: string) {
  const url = `${environment.rest_server.protokol}${environment.rest_server.host}${environment.rest_server.functions.api}user/user`;

  const body = {
    user_email: this.emailValue,
    user_password: this.passwordValue
  };

  /*const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });*/

  this.http.post(url, body, { /*headers*/ responseType: 'text' }).subscribe({
    next: (raw) => {
      console.log('Raw server response:', raw);

      // Find the first '{' in case there are HTML warnings before JSON
      const jsonStart = raw.indexOf('{');
      if (jsonStart === -1) {
        this.showToast('Neispravan odgovor sa servera.');
        return;
      }

      let res: any;
      try {
        res = JSON.parse(raw.slice(jsonStart));
      } catch (e) {
        console.error('JSON parse error:', e);
        this.showToast('Neispravan JSON odgovor sa servera.');
        return;
      }

      console.log('Parsed response:', res);

      if (res.status && res.message !== 'no permission') {
        this.showToast('Registracija uspješna! Možete se prijaviti.');
        this.isLogin = true;
      } else {
        this.showToast(res.message || 'Registracija nije uspjela.');
      }
    },
    error: (err) => {
      console.error(err);
      this.showToast('Greška prilikom registracije. Pokušajte ponovno.');
    }
  });
}


login() {
  const url = `${environment.rest_server.protokol}${environment.rest_server.host}${environment.rest_server.functions.token}`;

  const body = new URLSearchParams();
  body.set('grant_type', 'password');
  body.set('client_id', 'testclient');           
  body.set('client_secret', 'testpass');
  body.set('username', /*this.emailValue*/"matija.fsb@gmail.com");   
  body.set('password', /*this.passwordValue*/"Test12345"); 
  body.set('company', '4');  
  body.set('admin', 'admin');  

  console.log('Login body:', body.toString());

  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  this.http.post<any>(url, body.toString(), { headers }).subscribe({
    next: (res) => {
      console.log('Login response:', res);

      if (res.access_token) {
        localStorage.setItem('userToken', JSON.stringify({
          access_token: res.access_token,
          refresh_token: res.refresh_token,
          token_type: res.token_type,
          expiry: Date.now() + res.expires_in * 1000
        }));
        this.showToast('Prijava uspješna!');
        this.router.navigate(['/home']);
      } else {
        this.showToast(res.message || 'Pogrešan email ili lozinka.');
      }
    },
    error: (err) => {
      console.error('Login error:', err);
      this.showToast(err.error?.error_description || 'Greška prilikom prijave. Pokušajte ponovno.');
    }
  });
}

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

  cancel() {
    this.router.navigate(['/home']);
  }
}
