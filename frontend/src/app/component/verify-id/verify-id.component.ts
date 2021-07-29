import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { maskId } from 'src/app/util/util-functions';

@Component({
  selector: 'app-verify-id',
  templateUrl: './verify-id.component.html',
  styleUrls: ['./verify-id.component.scss']
})
export class VerifyIdComponent implements OnInit {

  role = '';
  isLoading = false;
  errorResponse = false;

  verifyForm = this.fb.group({
    userId: ['', [
      Validators.required,
      Validators.min(1000000000000),
      Validators.max(9999999999999)
    ]]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.role = data.role || this.role;
    });
  }

  onSubmit(): void {
    this.verifyForm.disable();
    this.isLoading = true;
    this.errorResponse = false;
    if (this.role) {
      this.verifyUserId();
    } else {
      this.checkUserStatus();
    }
  }

  verifyUserId(): void {
    this.userService.verifyUserId(this.verifyForm.controls.userId.value + '').subscribe(
      response => this.handleSuccessfulVerifyUserId(),
      errorResponse => this.handleErrorResponse()
    );
  }

  handleSuccessfulVerifyUserId(): void {
    this.verifyForm.enable();
    this.isLoading = false;
    this.router.navigate([`/${this.role}/review-tc`]);
  }

  handleErrorResponse(): void {
    this.verifyForm.enable();
    this.isLoading = false;
    this.errorResponse = true;
  }

  checkUserStatus(): void {
    this.userService.checkUserStatus(this.verifyForm.controls.userId.value + '').subscribe(
      response => this.handleSuccessfulCheckUserStatus(response),
      errorResponse => this.handleErrorResponse()
    );
  }

  handleSuccessfulCheckUserStatus(response: any): void {
    this.verifyForm.enable();
    this.isLoading = false;
    const maskedId = maskId(this.verifyForm.controls.userId.value);
    this.router.navigate([`/update-status`], {
      state: {
        id: maskedId,
        status: response.body.status
      }
    });
  }

}
