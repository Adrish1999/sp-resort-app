import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-admin-accounts',
  templateUrl: './admin-accounts.component.html',
  styleUrls: ['./admin-accounts.component.css']
})
export class AdminAccountsComponent implements OnInit, OnDestroy {

  public users: User[] = [];
  public showLoading: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(private authenticationService: AuthenticationService, private notificationService: NotificationService) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.authenticationService.getUsers().subscribe(
        (response: User[]) => {
          this.users = [...response];
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    );
  }

  onDeleteUser(id: number): void {
    this.subscriptions.push(
      this.authenticationService.deleteUser(id).subscribe(
        (response: any) => {
          this.sendNotification(NotificationType.SUCCESS, 'Successfully Deleted User With ID ' + id);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, 'An Error Occured While Deleting');
        }
      )
    );
    window.location.reload();
  }

  public onRegister(user: User): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.register(user).subscribe(
        (response: User): void => {
          this.showLoading = false;
          this.sendNotification(NotificationType.SUCCESS, `A new admin was created for ${response.username}.`);
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
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
}
