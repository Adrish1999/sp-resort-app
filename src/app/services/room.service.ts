import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Room } from '../model/room';
import { Booking } from '../model/booking';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private roomUrl: string = environment.roomManagementUrl + '/rooms';
  private bookingUrl: string = environment.roomManagementUrl + '/booking';

  constructor(private httpClient: HttpClient) { }

  public addRoom(room: Room): Observable<Room> {
    return this.httpClient.post<Room>(this.roomUrl, room);
  }

  public getAllRooms(): any {
    return this.httpClient.get(this.roomUrl);
  }

  public getAvailableRooms(object: any): any {
    return this.httpClient.post(this.roomUrl + "/available", object);
  }

  public getRoomByNumber(roomNumber: string): Observable<Room> {
    return this.httpClient.post<Room>(this.roomUrl + '/number', roomNumber);
  }

  public addBooking(booking: Booking): Observable<Booking> {
    return this.httpClient.post<Booking>(this.bookingUrl, booking);
  }

  public updateBooking(booking: Booking): Observable<Booking> {
    return this.httpClient.put<Booking>(this.bookingUrl, booking);
  }

  public getAllBookings(): any {
    return this.httpClient.get(this.bookingUrl);
  }

  public getAllBookingsByStatus(statusObject: any): any {
    return this.httpClient.post(this.bookingUrl + "/status", statusObject);
  }

  public confirmBookingStatus(request: any): any {
    return this.httpClient.post(this.bookingUrl + "/updateStatus", request);
  }

  public deleteBookingById(id: number): any {
    return this.httpClient.delete(`${this.bookingUrl}/${id}`);
  }
}
