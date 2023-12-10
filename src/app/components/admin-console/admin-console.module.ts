import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminConsoleComponent } from './admin-console.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { NotificationModule } from 'src/app/notification.module';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AddAndDisplayRoomsComponent } from './add-and-display-rooms/add-and-display-rooms.component';
import { FooterComponent } from '../footer/footer.component';
import { SharedFooterModule } from 'src/app/shared-modules/shared-footer.module';
import { BookingsComponent } from './bookings/bookings.component';
import { AdminAccountsComponent } from './admin-accounts/admin-accounts.component';

@NgModule({
  declarations: [
    AdminConsoleComponent,
    AddAndDisplayRoomsComponent,
    BookingsComponent,
    AdminAccountsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NotificationModule,
    AdminRoutingModule,
    SharedFooterModule
  ],
  providers: [AuthGuard, AuthenticationService, NotificationService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }]
})
export class AdminConsoleModule { }
