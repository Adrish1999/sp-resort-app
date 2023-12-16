import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit, OnDestroy {

  public loggedInUsername!: string;
  public showLoading: boolean = false;
  public newBookings: any;
  public confirmedBookings: any;
  public allBookings: any;
  public subscriptions: Subscription[] = [];

  constructor(private authenticationService: AuthenticationService, private notificationService: NotificationService, private roomService: RoomService) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.authenticationService.isLoggedIn();
    this.loggedInUsername = this.authenticationService.loggedInUsername;
    this.subscriptions.push(
      this.roomService.getAllBookings().subscribe(
        (response: any) => {
          this.allBookings = response;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
    this.fetchBookings('New');
    this.fetchBookings('Confirmed');
  }

  fetchBookings(status: string) {
    let requestPayload: any = {};
    requestPayload.status = status;
    this.subscriptions.push(
      this.roomService.getAllBookingsByStatus(requestPayload).subscribe(
        (response: any) => {
          if (status === 'New') {
            this.newBookings = response;
          }
          else {
            this.confirmedBookings = response;
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
  }

  confirmBooking(bookingId: string) {
    let requestPayload: any = {};
    requestPayload.newStatus = 'Confirmed';
    requestPayload.id = bookingId;
    this.subscriptions.push(
      this.roomService.confirmBookingStatus(requestPayload).subscribe(
        (response: any) => {
          this.sendNotification(NotificationType.SUCCESS, "Successfully Confirmed Booking with ID " + bookingId);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
        }
      )
    );
    window.location.reload();
  }

  onDeleteBooking(id: number): void {
    this.subscriptions.push(
      this.roomService.deleteBookingById(id).subscribe(
        (response: any) => {
          this.sendNotification(NotificationType.SUCCESS, 'Successfully Cancelled Booking With ID ' + id);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, 'An Error Occured While Deleting');
        }
      )
    );
    window.location.reload();
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    }
    else {
      this.notificationService.notify(notificationType, 'An Error Occured, Please Try Again');
    }
  }
}
