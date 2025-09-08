import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user) {
      this.ime = user.ime || '';
      this.prezime = user.prezime || '';
      this.telefon = user.telefon || '';
      this.email = user.email || '';
    }
  }

    saveChanges() {
    // Get all users
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Find the current user by email
    const index = users.findIndex((u: any) => u.email === this.email);
    if (index !== -1) {
      users[index].ime = this.ime;
      users[index].prezime = this.prezime;
      users[index].telefon = this.telefon;

      // Save back to localStorage
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(users[index]));
    }

    // Go back to profile page
    this.router.navigate(['/profil']);
  }

  backToProfil(){
    window.history.back();
  }

}
