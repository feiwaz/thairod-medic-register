import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserAccountDialogComponent } from 'src/app/dialog/user-account-dialog/user-account-dialog.component';
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
  ) { }

  openAccountCard(): void {
    this.dialog.open(UserAccountDialogComponent, {
      autoFocus: false,
      panelClass: 'dialog-responsive'
    });
  }

  onLogOutClick(): void {
    this.toastrService.success('ออกจากระบบสำเร็จ');
    this.authService.logout();
  }

}
