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
    const isAdmin = this.authServce.isAdmin();
    if (!isAdmin) {
      this.router.navigate(['/']);
    }
    return isAdmin;
  }

  canActivate(): boolean {
    this.authServce.decodeAccessToken();
    const isAdmin = this.authServce.isAdmin();
    if (!isAdmin) {
      this.router.navigate(['/']);
    }
    return isAdmin;
  }

}
