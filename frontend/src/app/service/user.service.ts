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

  getUser(id: string): Observable<any> {
    const url = `${environment.apiPrefix}/users/${id}`;
    return this.http.get<any>(url);
  }

  // verifyUserId(id: string): Observable<any> {
  //   const url = `${environment.apiUrl}/users/${id}/verify-id`;
  //   return this.http.post<any>(url, null);
  // }

  verifyUserId(id: string): Observable<any> {
    if (id === '1111122222333') {
      return of(new HttpResponse({ status: 200, body: { registerStatus: 'new user' } })).pipe(delay(1500));
    } else if (id === '2222211111444' || id === '2222211111555') {
      return of(new HttpResponse({ status: 200, body: { registerStatus: 'existing user' } })).pipe(delay(1500));
    } else {
      return throwError(new HttpErrorResponse({ status: 404 }));
    }
  }

  // checkUserStatus(id: string): Observable<any> {
  //   const url = `${environment.apiUrl}/users/${id}/check-status`;
  //   return this.http.post<any>(url, null);
  // }

  checkUserStatus(id: string): Observable<any> {
    if (id === '2222211111444') {
      return of(new HttpResponse({ status: 200, body: { status: 'approved' } })).pipe(delay(1500));
    } else if (id === '2222211111555') {
      return of(new HttpResponse({ status: 200, body: { status: 'pending' } })).pipe(delay(1500));
    } else {
      return throwError(new HttpErrorResponse({ status: 404 }));
    }
  }

  // createUser(id: string, user: any): Observable<any> {
  //   const url = `${environment.apiUrl}/users/${id}`;
  //   return this.http.post<any>(url, user);
  // }

  createUser(id: string, user: any): Observable<any> {
    if (id === '1111122222333') {
      return of(new HttpResponse({ status: 201, body: {} })).pipe(delay(1500));
    } else {
      return throwError(new HttpErrorResponse({ status: 404 }));
    }
  }

}
