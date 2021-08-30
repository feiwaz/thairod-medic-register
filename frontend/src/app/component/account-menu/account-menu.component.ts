import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { UserAccountDialogComponent } from '../../dialog/user-account-dialog/user-account-dialog.component';
import { AuthenticationService } from '../../service/authentication.service';

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
      width: '100%',
      panelClass: 'dialog-responsive'
    });
  }

  onLogOutClick(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'ยืนยันการออกจากระบบ',
        content: 'ท่านต้องการออกจากระบบ ใช่หรือไม่?',
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result && result.confirm === true) {
          this.toastrService.success('ออกจากระบบสำเร็จ');
          this.authService.logout();
        }
      }
    );
  }

}
