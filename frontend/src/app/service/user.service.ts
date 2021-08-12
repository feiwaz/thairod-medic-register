import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ChangePassword } from '../model/change-password.model';
import { User } from '../model/user.model';
import { BaseResourceService } from './base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseResourceService {

  constructor(http: HttpClient) {
    super(`${environment.apiPrefix}/users`, http);
  }

  getUsers(): Observable<User[]> {
    return super.getResources();
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.resourcePrefix}`, user);
  }

  updateUser(id: string, user: User): Observable<any> {
    return this.http.put<any>(`${this.resourcePrefix}/${id}`, user);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.resourcePrefix}/${id}`);
  }

  changePassword(id: string, credential: ChangePassword): Observable<any> {
    return this.http.put<any>(`${this.resourcePrefix}/${id}/change-password`, credential);
  }

  patchUser(id: string, user: User): Observable<any> {
    return this.http.patch<any>(`${this.resourcePrefix}/${id}`, user);
  }

}
