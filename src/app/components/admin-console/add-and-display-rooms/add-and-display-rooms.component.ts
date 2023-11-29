import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Room } from 'src/app/model/room';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-add-and-display-rooms',
  templateUrl: './add-and-display-rooms.component.html',
  styleUrls: ['./add-and-display-rooms.component.css']
})
export class AddAndDisplayRoomsComponent implements OnInit, OnDestroy {

  public loggedInUsername!: string;
  public showLoading: boolean = false;
  public rooms: any;
  public subsriptions: Subscription[] = [];

  constructor(private authenticationService: AuthenticationService, private notificationService: NotificationService, private roomService: RoomService) { }

  ngOnDestroy(): void {
    this.subsriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.authenticationService.isLoggedIn();
    this.loggedInUsername = this.authenticationService.loggedInUsername;
    this.subsriptions.push(
      this.roomService.getAllRooms().subscribe(
        (response: any) => {
          this.rooms = response;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  onSubmitRoomDetails(room: Room): void {
    this.showLoading = true;
    this.subsriptions.push(
      this.roomService.addRoom(room).subscribe(
        (response: Room) => {
          this.showLoading = false;
          this.sendErrorNotification(NotificationType.SUCCESS, "Successfully added room");
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  private sendErrorNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    }
    else {
      this.notificationService.notify(notificationType, 'An Error Occured, Please Try Again');
    }
  }
}
