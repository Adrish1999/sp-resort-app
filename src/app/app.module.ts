import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReservationComponent } from './components/reservation/reservation.component';
import { LoginComponent } from './components/login/login.component';
import { NotificationModule } from './notification.module';
import { AuthenticationService } from './services/authentication.service';
import { NotificationService } from './services/notification.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AdminConsoleModule } from './components/admin-console/admin-console.module';
import { SharedFooterModule } from './shared-modules/shared-footer.module';
import { RoomService } from './services/room.service';
import { FoodSliderComponent } from './components/food-slider/food-slider.component';
import { register } from 'swiper/element/bundle';
import 'swiper/css/bundle';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { PaymentService } from './services/payment.service';
import { CheckoutComponent } from './components/checkout/checkout.component';

register();

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ReservationComponent,
    LoginComponent,
    FoodSliderComponent,
    SchedulerComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NotificationModule,
    AdminConsoleModule,
    SharedFooterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,

    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ],
  providers: [AuthGuard, AuthenticationService, NotificationService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, RoomService, PaymentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
