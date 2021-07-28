import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-verify-id',
  templateUrl: './verify-id.component.html',
  styleUrls: ['./verify-id.component.scss']
})
export class VerifyIdComponent implements OnInit {

  role = '';
  isLoading = false;
  action = 'ลงทะเบียน'
  errorResponse = false;

  verifyForm = new FormGroup({
    userId: new FormControl({ value: '', disabled: false },
      [Validators.required, Validators.min(1000000000000), Validators.max(9999999999999)]
    )
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (!data.role) this.action = 'ตรวจสอบ'
      else this.role = data.role;
    });
  }

  onSubmit(): void {
    this.verifyForm.disable();
    this.isLoading = true;
    this.errorResponse = false;
    this.userService.verifyUserId(this.verifyForm.controls.userId.value + '').subscribe(
      response => this.handleSuccessfulResponse(),
      errorResponse => this.handleErrorResponse()
    );
  }

  handleSuccessfulResponse(): void {
    this.verifyForm.enable();
    this.isLoading = false;
    this.router.navigate([`/${this.role}/review-tc`], {
      skipLocationChange: false
    });
  }

  handleErrorResponse(): void {
    this.verifyForm.enable();
    this.isLoading = false;
    this.errorResponse = true;
  }

}
