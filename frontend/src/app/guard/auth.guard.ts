import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) { }

  canLoad(): boolean {
    this.authService.decodeAccessToken();
    const isLoggedIn = this.authService.isLoggedIn;
    if (!isLoggedIn) {
      this.router.navigate(['/admin']);
    }
    return isLoggedIn;
  }

  canActivate(): boolean {
    this.authService.decodeAccessToken();
    const isLoggedIn = this.authService.isLoggedIn;
    if (!isLoggedIn) {
      this.router.navigate(['/admin']);
    }
    return isLoggedIn;
  }

}
