import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  findUser(id: number): Observable<any> {
    const url = `${environment.apiPrefix}/users/${id}`;
    return this.http.get<any>(url);
  }

  create(user: any): Observable<any> {
    user.dateOfBirth = moment(user.dateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const url = `${environment.apiPrefix}/users`;
    return this.http.post<any>(url, user);
  }

}
