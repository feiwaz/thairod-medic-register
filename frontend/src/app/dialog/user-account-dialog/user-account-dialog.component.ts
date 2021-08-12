import { Component } from '@angular/core';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-user-account-dialog',
  templateUrl: './user-account-dialog.component.html',
  styleUrls: ['./user-account-dialog.component.scss']
})
export class UserAccountDialogComponent {

  isLoading = false;

  constructor(public authService: AuthenticationService) { }

}
