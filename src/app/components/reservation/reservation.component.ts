import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { RoomPriceByType } from 'src/app/enum/room-price.enum';
import { Booking } from 'src/app/model/booking';
import { Room } from 'src/app/model/room';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PaymentService } from 'src/app/services/payment.service';
import { RoomService } from 'src/app/services/room.service';

declare var Razorpay: any;
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
  public noRoomsAvailable: boolean = false;
  public availableRooms: any;
  public loggedInUsername!: string;
  public subsriptions: Subscription[] = [];
  public isRoomSelected: boolean = false;
  public selectedRoom: Room = new Room();

  constructor(private router: Router, private authenticationService: AuthenticationService, private notificationService: NotificationService, private roomService: RoomService, private paymentService: PaymentService, private dataService: DataService) { }

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

  onSubmitBookingDetails(formData: any, paymentResponse: any): void {
    let booking: Booking = new Booking();
    booking.personName = formData.title + ' ' + formData.fname + ' ' + formData.lname;
    booking.email = formData.email;
    booking.phoneNumber = formData.phone;
    booking.checkInDate = formData.checkInDate;
    booking.checkOutDate = formData.checkOutDate;
    booking.totalAmount = this.totalPrice;
    booking.isPaid = true;
    booking.bookingStatus = 'New';
    booking.paymentId = paymentResponse.razorpay_payment_id;
    booking.roomNumber = this.selectedRoom.roomNumber;

    this.subsriptions.push(
      this.roomService.addBooking(booking).subscribe(
        (response: any) => {
          this.displayAvailableRooms = false;
          this.isRoomSelected = false;
          this.totalPrice = 0;
          this.dataService.bookingDetails = response;
          this.dataService.bookingId = response.id;
          this.router.navigateByUrl('/checkout-success');
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  public createTransactionAndSubmitBooking(formData: any): void {
    this.subsriptions.push(
      this.paymentService.createTransaction(this.totalPrice).subscribe(
        (response: any) => {
          console.log(response);
          this.openTransactionModal(response, formData);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  public openTransactionModal(response: any, formData: any) {
    var options = {
      order_id: response.orderId,
      key: response.key,
      amount: response.amount,
      currency: response.currency,
      name: 'Swapno Puran Resort',
      description: 'Payment for Room Reservation',
      image: 'https://cdn.pixabay.com/photo/2018/02/24/17/17/window-3178666_640.jpg',
      handler: (resp: any) => {
        if (resp != null && resp.razorpay_payment_id != null) {
          console.log(resp);
          this.sendNotification(NotificationType.SUCCESS, "Payment Successful");
          this.processPaymentResponse(resp, formData);
        }
        else {
          this.sendNotification(NotificationType.ERROR, 'Payment Failed');
        }
      },
      prefill: {
        name: formData.title + ' ' + formData.fname + ' ' + formData.lname,
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        address: 'Swapno Puran Resort Booking'
      },
      theme: {
        color: '#4847F7'
      }
    };
    var razorPayObject = new Razorpay(options);
    razorPayObject.open();
  }

  processPaymentResponse(resp: any, formData: any): void {
    this.displayAvailableRooms = false;
    this.onSubmitBookingDetails(formData, resp);
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
          if (response != null && response.length > 0) {
            this.availableRooms = response;
            this.displayAvailableRooms = true;
            this.noRoomsAvailable = false;
          }
          else {
            this.displayAvailableRooms = true;
            this.noRoomsAvailable = true;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
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
    this.sendNotification(NotificationType.SUCCESS, 'Room selected successfully, proceed to checkout');
  }
}
