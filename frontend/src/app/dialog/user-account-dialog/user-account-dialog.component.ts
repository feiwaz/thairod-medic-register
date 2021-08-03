import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-account-dialog',
  templateUrl: './user-account-dialog.component.html',
  styleUrls: ['./user-account-dialog.component.scss']
})
export class UserAccountDialogComponent implements OnInit {

  isLoading = true;
  user: User = { _id: '', email: '', firstName: '' };

  constructor(
    private userService: UserService,
    public authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  private getUser(): void {
    this.userService.getUser(this.authService.currentUser._id).subscribe(
      user => {
        this.isLoading = false;
        console.log(user);
      },
      errorResponse => this.isLoading = false
    );
  }

}
