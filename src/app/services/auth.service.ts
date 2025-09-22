import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'userToken';
  private apiUrl = `${environment.rest_server.protokol}${environment.rest_server.host}${environment.rest_server.functions.token}`;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string, company: number, admin: string): Observable<any> {
    const body = {
      grant_type: 'password',
      client_id: 'testclient',
      client_secret: 'testpass',
      username,
      password,
      company,
      admin
    };

    console.log('Logging in with:', body);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      tap(response => {
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  isLoggedIn(): boolean {
  return !!localStorage.getItem('currentUser');
}

  getTokenData(): any {
    const token = localStorage.getItem(this.tokenKey);
    return token ? JSON.parse(token) : null;
  }

  refreshToken(): Promise<void> {
  const url = `${environment.rest_server.protokol}${environment.rest_server.host}${environment.rest_server.functions.token}`;
  console.log('Refreshing token from URL:', url);
  const tokenData = this.getTokenData();

  const body = new URLSearchParams();
  body.set('grant_type', 'refresh_token');
  body.set('client_id', 'testclient');
  body.set('client_secret', 'testpass');
  body.set('refresh_token', tokenData.refresh_token);

  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  return new Promise((resolve, reject) => {
    this.http.post<any>(url, body.toString(), { headers }).subscribe({
      next: (res) => {
        if (res.access_token) {
          const expiry = Date.now() + res.expires_in * 1000;
          localStorage.setItem(this.tokenKey, JSON.stringify({
            access_token: res.access_token,
            token_type: res.token_type,
            expiry,
            refresh_token: res.refresh_token || tokenData.refresh_token
          }));
          resolve();
        } else {
          reject('Refresh token failed.');
        }
      },
      error: (err) => {
        console.error('Refresh error:', err);
        reject(err.error?.error_description || 'Greška kod obnove tokena.');
      }
    });
  });
}


  /** Returns Authorization header for API calls */
  getAuthHeaders(): HttpHeaders {
    const tokenData = this.getTokenData();
    return new HttpHeaders({
      'Authorization': `Bearer ${tokenData.access_token}`
    });
  }


getUser(): Promise<any> {
  const url = `${environment.rest_server.protokol}${environment.rest_server.host}${environment.rest_server.functions.api}user/user`;
  console.log('Fetching user from URL:', url);

  return new Promise((resolve, reject) => {
    this.http.get<any>(url, { headers: this.getAuthHeaders() }).subscribe({
      next: (res) => {
        console.log('User data raw:', res);

        if (!res || !res.data) {
          reject('Neispravan odgovor sa servera.');
          return;
        }

        const user = res.data; 

        const mappedUser = {
          ime: user.user_firstname,
          prezime: user.user_lastname,
          telefon: user.user_phone,
          email: user.user_email
        };

        localStorage.setItem('currentUser', JSON.stringify(mappedUser));
        resolve(mappedUser);
      },
      error: (err) => {
        console.error('Get user error:', err);
        reject('Ne mogu dohvatiti korisnika.');
      }
    });
  });
}

updateUser(data: { ime: string; prezime: string; telefon: string }): Promise<any> {
  const url = `${environment.rest_server.protokol}${environment.rest_server.host}${environment.rest_server.functions.api}user/user`;

  const payload = {
    //user_email: this.getCurrentUser().email,
    //user_password: this.getCurrentUser().password,
    user_firstname: data.ime,
    user_lastname: data.prezime,
    user_phone: data.telefon
  };

  return new Promise((resolve, reject) => {
    this.http.put<any>(url, payload, { headers: this.getAuthHeaders() }).subscribe({
      next: (res) => {
        console.log('Update user response:', res);
        if (res.status) {
          // refresh local copy
          this.getUser().then(() => resolve(res));
        } else {
          reject(res.message || 'Greška kod ažuriranja profila.');
        }
      },
      error: (err) => {
        console.error('Update user error:', err);
        reject('Ne mogu ažurirati profil.');
      }
    });
  });
} 



getCurrentUser(): any {
  return JSON.parse(localStorage.getItem('currentUser') || 'null');
}
}
