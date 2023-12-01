import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { RoomPriceByType } from 'src/app/enum/room-price.enum';
import { Booking } from 'src/app/model/booking';
import { Room } from 'src/app/model/room';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit, OnDestroy {

  public invalidDateRangeMessage: string = '';
  public startDate: Date = new Date();
  public totalPrice: number = 0;
  public displayAvailableRooms: boolean = false;
  public availableRooms: any;
  public loggedInUsername!: string;
  public subsriptions: Subscription[] = [];
  public isRoomSelected: boolean = false;
  public selectedRoom: Room = new Room();

  constructor(private authenticationService: AuthenticationService, private notificationService: NotificationService, private roomService: RoomService) { }

  ngOnDestroy(): void {
    this.subsriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.invalidDateRangeMessage = '';
    this.startDate = new Date();
    this.displayAvailableRooms = false;
    this.authenticationService.isLoggedIn();
    this.loggedInUsername = this.authenticationService.loggedInUsername;
    this.isRoomSelected = false;
  }

  onSubmitBookingDetails(formData: any): void {
    console.log(formData);
    let booking: Booking = new Booking();
    booking.personName = formData.title + ' ' + formData.fname + ' ' + formData.lname;
    booking.email = formData.email;
    booking.phoneNumber = formData.phone;
    booking.checkInDate = formData.checkInDate;
    booking.checkOutDate = formData.checkOutDate;
    booking.totalAmount = this.totalPrice;
    booking.isPaid = true;
    booking.bookingStatus = 'New'
    booking.roomNumber = this.selectedRoom.roomNumber;

    this.subsriptions.push(
      this.roomService.addBooking(booking).subscribe(
        (response: Booking) => {
          this.sendErrorNotification(NotificationType.SUCCESS, "Successfully created booking");
          this.displayAvailableRooms = false;
          this.isRoomSelected = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }


  checkDate(inDate: Date, outDate: Date): void {
    console.log(inDate, outDate);
    if (outDate < inDate) {
      this.invalidDateRangeMessage = 'Check-out date should be greater than check-in date';
    }
    else {
      this.invalidDateRangeMessage = '';
    }
  }

  calculatePrice(roomType: string): void {
    roomType = roomType.toUpperCase();
    if (roomType === 'IMPERIAL') {
      this.totalPrice = RoomPriceByType.IMPERIAL;
    }
    else if (roomType === 'PREMIUM') {
      this.totalPrice = RoomPriceByType.PREMIUM;
    }
    else {
      this.totalPrice = RoomPriceByType.EXECUTIVE;
    }
  }

  checkRoomAvailability(roomType: string, inDate: Date, outDate: Date): void {
    let requestPayload: any = {};
    requestPayload.roomType = roomType;
    requestPayload.checkInDate = inDate;
    requestPayload.checkOutDate = outDate;
    this.subsriptions.push(
      this.roomService.getAvailableRooms(requestPayload).subscribe(
        (response: any) => {
          this.availableRooms = response;
          this.displayAvailableRooms = true;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, errorResponse.error.message);
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

  public onSelectRoom(room: Room): void {
    this.selectedRoom = room;
    this.isRoomSelected = true;
  }
}
