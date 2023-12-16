import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Booking } from 'src/app/model/booking';
import { DataService } from 'src/app/services/data.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  public booking: Booking = new Booking();
  public bookingId: number = 0
  public displayInvoice: boolean = false;
  public currentDate: Date = new Date();
  public subsriptions: Subscription[] = [];
  
  @ViewChild('invoice') invoiceElement!: ElementRef;
  constructor(private notificationService: NotificationService, private roomService: RoomService, private dataService: DataService) { }

  ngOnDestroy(): void {
    this.subsriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.bookingId = this.dataService.bookingId;
    this.booking = this.dataService.bookingDetails;
    this.sendNotification(NotificationType.SUCCESS, "Booking Creation Was Successful");
    this.displayInvoice = false;
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
      PDF.save(this.bookingId + '-' + this.booking.personName + '.pdf');
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
