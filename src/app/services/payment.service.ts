import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private paymentUrl: string = environment.roomManagementUrl + '/payment';

  constructor(private httpClient: HttpClient) { }

  public createTransaction(amount: number): any {
    return this.httpClient.get(`${this.paymentUrl}/createTransaction/${amount}`);
  }
}
