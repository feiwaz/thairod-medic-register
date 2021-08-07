import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isLoggedIn = false;
  currentUser = {
    id: '', email: '', firstName: '', lastName: '', contactNumber: '',
    isActive: '', role: ''
  };

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  getRefreshToken(): void {
    // const refreshToken = localStorage.getItem('refreshToken') || '';
    // if (refreshToken) {
    //   this.refreshToken().subscribe();
    // } else {
    //   this.logout();
    // }
    // TODO: should refresh token
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      this.decodeAccessToken();
    } else {
      this.logout();
    }
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${environment.apiPrefix}/auth/register`, user);
  }

  login(email: string, password: string): Observable<any> {
    const body = `username=${email}&password=${encodeURIComponent(password)}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    return this.http.post<any>(`${environment.apiPrefix}/auth/login`, body, options).pipe(
      tap(response => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.decodeAccessToken();
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken') || '';
    return this.http.post<any>(`${environment.apiPrefix}/auth/refresh-token`, { refreshToken }).pipe(
      tap({
        next: response => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          this.decodeAccessToken();
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.isLoggedIn = false;
    this.currentUser = {
      id: '', email: '', firstName: '', lastName: '', contactNumber: '',
      isActive: '', role: ''
    };;
    this.dialog.closeAll();
    this.router.navigate(['/admin']);
  }

  decodeAccessToken(): void {
    try {
      const accessToken = localStorage.getItem('accessToken') || '';
      const decodedUser = this.jwtHelper.decodeToken(accessToken).user;
      this.isLoggedIn = true;
      const { id, email, firstName, lastName, contactNumber,
        isActive, role } = JSON.parse(decodedUser);
      this.currentUser = {
        id, email, firstName, lastName, contactNumber,
        isActive, role
      };
    } catch (error) {
      this.logout();
    }
  }

  isAdmin(): boolean {
    let isAdmin = false;
    if (this.currentUser && this.currentUser.role && this.isLoggedIn === true) {
      isAdmin = this.currentUser.role.toLowerCase() === 'admin';
    }
    return isAdmin;
  }

  updateCurrentUser(user: User): void {
    const { id, email, firstName, lastName,
      contactNumber, isActive, role } = user;
    this.currentUser = {
      id, email, firstName, lastName, contactNumber,
      isActive, role
    } as any;
  }

}
