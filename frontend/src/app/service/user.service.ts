import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChangePassword } from '../model/change-password.model';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  findOne(id: number): Observable<any> {
    const url = `${environment.apiPrefix}/users/${id}`;
    return this.http.get<any>(url);
  }

  create(user: any): Observable<any> {
    user.dateOfBirth = moment(user.dateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const url = `${environment.apiPrefix}/users`;
    return this.http.post<any>(url, user);
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${environment.apiPrefix}/users/${userId}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiPrefix}/users`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiPrefix}/users`, user);
  }

  updateUser(id: string, user: User): Observable<any> {
    return this.http.put<any>(`${environment.apiPrefix}/users/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiPrefix}/users/${id}`);
  }

  changePassword(id: string, credential: ChangePassword): Observable<any> {
    return this.http.put<any>(`${environment.apiPrefix}/users/${id}/change-password`, credential);
  }

}
