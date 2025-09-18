import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  cancel() {
    this.router.navigate(['/home']);
  }

}
