import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient) { }

  findOne(nationalId: number): Observable<any> {
    const url = `${environment.apiPrefix}/doctors/${nationalId}`;
    return this.http.get<any>(url);
  }

  create(user: any): Observable<any> {
    user.dateOfBirth = moment(user.dateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const url = `${environment.apiPrefix}/doctors`;
    return this.http.post<any>(url, user);
  }

}
