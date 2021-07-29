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

  getUser(id: number): Observable<any> {
    const url = `${environment.apiPrefix}/users/${id}`;
    return this.http.get<any>(url);
  }

  findOne(id: number): Observable<any> {
    const url = `${environment.apiPrefix}/users/${id}`;
    return this.http.get<any>(url);
  }

  create(user: any): Observable<any> {
    const url = `${environment.apiPrefix}/users`;
    return this.http.post<any>(url, user);
  }

}
