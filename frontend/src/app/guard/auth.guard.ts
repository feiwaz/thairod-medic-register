import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {

  constructor(
    private router: Router,
    private authServce: AuthenticationService
  ) { }

  canLoad(): boolean {
    this.authServce.decodeAccessToken();
    const isLoggedIn = this.authServce.isLoggedIn;
    if (!isLoggedIn) {
      this.router.navigate(['/admin']);
    }
    return isLoggedIn;
  }

  canActivate(): boolean {
    this.authServce.decodeAccessToken();
    const isLoggedIn = this.authServce.isLoggedIn;
    if (!isLoggedIn) {
      this.router.navigate(['/admin']);
    }
    return isLoggedIn;
  }

}
