import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private selectedDate: string | null = null;
  private selectedTime: string | null = null;

  setDate(date: string) {
    this.selectedDate = date;
  }

  getDate(): string | null {
    return this.selectedDate;
  }

  setTime(time: string) {
    this.selectedTime = time;
  }

  getTime(): string | null {
    return this.selectedTime;
  }
}
