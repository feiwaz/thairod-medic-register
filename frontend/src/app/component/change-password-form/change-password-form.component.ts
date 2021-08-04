import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';
import { CustomValidators } from 'src/app/util/custom-validators';

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss']
})
export class ChangePasswordFormComponent implements OnInit {

  isLoading = false;
  enableCredentialForm = false;
  hideCurrentPassword = true;
  hidePassword = true;
  hideConfirmPassword = true;

  changePasswordForm = this.fb.group({
    changePasswordCheckbox: [false],
    credential: this.fb.group({
      currentPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, CustomValidators.compareConfirmPassword)
  });

  @Input() data = { _id: '' };
  @ViewChild('currentPassword') currentPasswordElement: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void { this.subscribeChangePasswordCheckboxEvent(); }

  private subscribeChangePasswordCheckboxEvent(): void {
    this.changePasswordForm.controls.changePasswordCheckbox.valueChanges.subscribe(
      (checked: boolean) => {
        this.enableCredentialForm = checked;
        if (checked) {
          setTimeout(() => this.currentPasswordElement.nativeElement.focus(), 0);
        }
      }
    );
  }

  onChangePasswordCheckboxChanged(event: MatCheckboxChange): void {
    this.enableCredentialForm = event.checked;
  }

  onSubmit(): void {
    this.isLoading = true;
    const credentialForm = this.changePasswordForm.controls.credential;
    credentialForm.disable();
    const currentPassword = credentialForm.get('currentPassword')?.value;
    const password = credentialForm.get('password')?.value;
    const confirmPassword = credentialForm.get('confirmPassword')?.value;
    this.userService.changePassword(this.data._id, { currentPassword, password, confirmPassword }).subscribe(
      response => this.handleSuccessfulUpdate(),
      errorResponse => this.handleErrorUpdate()
    );
  }

  private handleSuccessfulUpdate(): void {
    this.isLoading = false;
    const credentialForm = this.changePasswordForm.controls.credential;
    credentialForm.enable();
    this.changePasswordForm.reset();
    this.changePasswordForm.markAsPristine();
    this.toastrService.success('เปลี่ยนรหัสผ่านสำเร็จ');
  }

  private handleErrorUpdate(): void {
    this.isLoading = false;
    const credentialForm = this.changePasswordForm.controls.credential;
    credentialForm.enable();
    this.toastrService.warning('เปลี่ยนรหัสผ่านไม่สำเร็จ');
  }

}
