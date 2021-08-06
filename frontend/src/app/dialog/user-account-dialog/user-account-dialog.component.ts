import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-user-account-dialog',
  templateUrl: './user-account-dialog.component.html',
  styleUrls: ['./user-account-dialog.component.scss']
})
export class UserAccountDialogComponent implements OnInit {

  isLoading = false;

  constructor(public authService: AuthenticationService) { }

  ngOnInit(): void { }

}
