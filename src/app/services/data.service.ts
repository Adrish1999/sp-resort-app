import { Injectable } from '@angular/core';
import { Booking } from '../model/booking';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  public successBookingInfo: Booking = new Booking();
}
