import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    public dialog: MatDialog
  ) { }

  login(email: string, password: string): Observable<any> {
    const body = `email=${email}&password=${encodeURIComponent(password)}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    return this.http.post<any>('/auth/login', body, options);
  }

}
