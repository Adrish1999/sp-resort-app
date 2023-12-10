import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Room } from 'src/app/model/room';
import { DataService } from 'src/app/services/data.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  public booking: any;
  public displayInvoice: boolean = false;
  public currentDate: Date = new Date();
  public roomDetails: Room = new Room();
  public subsriptions: Subscription[] = [];
  
  @ViewChild('invoice') invoiceElement!: ElementRef;
  constructor(private dataService: DataService, private notificationService: NotificationService, private roomService: RoomService) { }

  ngOnDestroy(): void {
    this.subsriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.booking = this.dataService.successBookingInfo;
    this.sendNotification(NotificationType.SUCCESS, "Successfully Created Booking For " + this.booking.personName);
    this.displayInvoice = false;
    this.subsriptions.push(
      this.roomService.getRoomByNumber(this.booking.roomNumber).subscribe(
        (response: any) => {
          this.roomDetails = response;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  public generateInvoice(): void {
    this.displayInvoice = true;
    html2canvas(this.invoiceElement.nativeElement, { scale: 3 }).then((canvas) => {
      const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
      const fileWidth = 200;
      const generatedImageHeight = (canvas.height * fileWidth) / canvas.width;
      let PDF = new jsPDF('p', 'mm', 'a4',);
      PDF.addImage(imageGeneratedFromTemplate, 'PNG', 0, 5, fileWidth, generatedImageHeight,);
      PDF.html(this.invoiceElement.nativeElement.innerHTML)
      PDF.save(this.booking.id + '-' + this.booking.personName + '.pdf');
    });
    this.displayInvoice = false;
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
