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

@NgModule({
  declarations: [
    AdminConsoleComponent,
    AddAndDisplayRoomsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NotificationModule,
    AdminRoutingModule
  ],
  providers: [AuthGuard, AuthenticationService, NotificationService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }]
})
export class AdminConsoleModule { }
