import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Room } from '../model/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private roomUrl: string = environment.roomManagementUrl + '/rooms';

  constructor(private httpClient: HttpClient) { }

  public addRoom(room: Room): Observable<Room> {
    return this.httpClient.post<Room>(this.roomUrl, room);
  }

  public getAllRooms(): any {
    return this.httpClient.get(this.roomUrl);
  }
}
