import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // verifyUserId(userId: string): Observable<any> {
  //   const url = `${environment.apiUrl}/${userId}/verify`;
  //   return this.http.post<any>(url, null);
  // }

  verifyUserId(userId: string): Observable<any> {
    if (userId === '1111122222333') {
      return of(new HttpResponse({ status: 200, body: {} })).pipe(delay(1500));
    } else {
      return throwError(new HttpErrorResponse({ status: 404 }));
    }
  }

}
