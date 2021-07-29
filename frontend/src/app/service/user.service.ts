import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from "rxjs/operators";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUser(userId: string): Observable<any> {
    const url = `${environment.apiPrefix}/users/${userId}`;
    return this.http.get<any>(url);
  }

  // verifyUserId(userId: string): Observable<any> {
  //   const url = `${environment.apiUrl}/users/${userId}/verify-id`;
  //   return this.http.post<any>(url, null);
  // }

  verifyUserId(userId: string): Observable<any> {
    if (userId === '1111122222333') {
      return of(new HttpResponse({ status: 200, body: { registerStatus: 'new user' } })).pipe(delay(1500));
    } else if (userId === '2222211111444' || userId === '2222211111555') {
      return of(new HttpResponse({ status: 200, body: { registerStatus: 'existing user' } })).pipe(delay(1500));
    } else {
      return throwError(new HttpErrorResponse({ status: 404 }));
    }
  }

  // checkUserStatus(userId: string): Observable<any> {
  //   const url = `${environment.apiUrl}/users/${userId}/check-status`;
  //   return this.http.post<any>(url, null);
  // }

  checkUserStatus(userId: string): Observable<any> {
    if (userId === '2222211111444') {
      return of(new HttpResponse({ status: 200, body: { status: 'approved' } })).pipe(delay(1500));
    } else if (userId === '2222211111555') {
      return of(new HttpResponse({ status: 200, body: { status: 'pending' } })).pipe(delay(1500));
    } else {
      return throwError(new HttpErrorResponse({ status: 404 }));
    }
  }

  // createUser(userId: string, user: any): Observable<any> {
  //   const url = `${environment.apiUrl}/users/${userId}`;
  //   return this.http.post<any>(url, user);
  // }

  createUser(userId: string, user: any): Observable<any> {
    if (userId === '1111122222333') {
      return of(new HttpResponse({ status: 201, body: {} })).pipe(delay(1500));
    } else {
      return throwError(new HttpErrorResponse({ status: 404 }));
    }
  }

}
