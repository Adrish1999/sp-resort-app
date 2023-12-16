import { Injectable } from '@angular/core';
import { Booking } from '../model/booking';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public bookingDetails: Booking = new Booking();
  public bookingId: any;

  constructor() { }
}
