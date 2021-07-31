import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isLoggedIn = false;
  currentUser = { _id: '', email: '', name: '', role: '' };

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  getRefreshToken(): void {
    const refreshToken = localStorage.getItem('refreshToken') || '';
    if (refreshToken) {
      this.refreshToken().subscribe();
    } else {
      this.logout();
    }
  }

  register(user: any): Observable<any> {
    return this.http.post<any>('/auth/register', user);
  }

  login(email: string, password: string): Observable<any> {
    const body = `email=${email}&password=${encodeURIComponent(password)}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    return this.http.post<any>('/auth/login', body, options).pipe(
      tap(response => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.decodeAccessToken();
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken') || '';
    return this.http.post<any>('/auth/refresh-token', { refreshToken }).pipe(
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
    this.currentUser = { _id: '', email: '', name: '', role: '' };
    this.dialog.closeAll();
    this.router.navigate(['/admin']);
  }

  decodeAccessToken(): void {
    try {
      const accessToken = localStorage.getItem('accessToken') || '';
      const decodedUser = this.jwtHelper.decodeToken(accessToken).user;
      this.isLoggedIn = true;
      const { _id, name, email, role } = decodedUser;
      this.currentUser = { _id, name, email, role: role.text };
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
    const { _id, name, email, role } = user;
    this.currentUser = { _id, name, email, role: role?.text } as any;
  }

}
