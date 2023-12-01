import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule } from '@angular/forms';
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

register();

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ReservationComponent,
    LoginComponent,
    FoodSliderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NotificationModule,
    AdminConsoleModule,
    SharedFooterModule
  ],
  providers: [AuthGuard, AuthenticationService, NotificationService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, RoomService],
  bootstrap: [AppComponent]
})
export class AppModule { }
