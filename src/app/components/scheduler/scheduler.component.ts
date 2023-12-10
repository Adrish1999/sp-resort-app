import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { endOfDay, startOfDay } from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Booking } from 'src/app/model/booking';
import { CalendarColors } from 'src/app/model/calendar-colors';
import { Room } from 'src/app/model/room';
import { NotificationService } from 'src/app/services/notification.service';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit, OnDestroy {

  public events: CalendarEvent[] = [];
  public displayEvents: CalendarEvent[] = [];
  public subscriptions: Subscription[] = [];
  public selectedDate: Date = new Date();
  public availableRoomsCount: number = 0;
  public allRooms: Room[] = [];
  public displayStatus: boolean = false;
  refreshCalendar: Subject<void> = new Subject();

  constructor(private notificationService: NotificationService, private roomService: RoomService) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.displayEvents = [];

    this.subscriptions.push(
      this.roomService.getAllRooms().subscribe(
        (response: any) => {
          this.allRooms = response;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );

    this.subscriptions.push(
      this.roomService.getAllBookings().subscribe(
        (response: any) => {
          for (let booking of response) {
            let eventColor: any = {};
            let eventTitle: string = '';
            if(booking.bookingStatus === 'New') {
              eventColor = CalendarColors.yellow
              eventTitle = 'Room Number ' + booking.roomNumber + " Booking Under Review";
            }
            else {
              eventColor = CalendarColors.green;
              eventTitle = 'Room Number ' + booking.roomNumber + " Already Booked";
            }
            let event: CalendarEvent = {
              start: startOfDay(new Date(booking.checkInDate)),
              title: eventTitle,
              end: endOfDay(new Date(booking.checkOutDate)),
              color: eventColor
            }
            this.events.push(event);
          };
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
    setTimeout(() => {
      this.refreshCalendar.next();
    }, 1200);
  }

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;

  setView(view: CalendarView) {
    this.view = view;
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.displayStatus = true;
    this.displayEvents = [...events];
    this.selectedDate = date;
    this.availableRoomsCount = this.allRooms.length - events.length;
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