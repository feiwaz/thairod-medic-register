import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss']
})
export class AccountMenuComponent {

  constructor(
    private toastrService: ToastrService,
    public authService: AuthenticationService,
    public dialog: MatDialog
  ) {
    //TODO: to be removed later after authService impl
    this.authService.isLoggedIn = true;
  }

  openAccountCard(): void { }

  onLogOutClick(): void {
    this.toastrService.success('Logged out successfully');
    this.authService.logout();
  }

}
