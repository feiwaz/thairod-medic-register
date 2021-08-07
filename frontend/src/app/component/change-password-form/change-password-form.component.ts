import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';
import { CustomValidators } from 'src/app/util/custom-validators';

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss']
})
export class ChangePasswordFormComponent implements OnInit {

  hideCurrentPassword = true;
  hidePassword = true;
  hideConfirmPassword = true;

  changePasswordForm = this.fb.group({
    credential: new FormGroup({
      currentPassword: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', Validators.required)
    }, CustomValidators.compareConfirmPassword)
  });

  @Input() data = { id: '' };
  @Input() isLoading = false;
  @Output() isLoadingChange = new EventEmitter<boolean>();
  @ViewChild('currentPassword') currentPasswordElement: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void { }

  onSubmit(formDirective: FormGroupDirective): void {
    this.toggleIsLoading(true);
    const credentialForm = this.changePasswordForm.controls.credential;
    credentialForm.disable();
    const changePasswordBody = {
      currentPassword: credentialForm.get('currentPassword')?.value,
      password: credentialForm.get('password')?.value,
      confirmPassword: credentialForm.get('confirmPassword')?.value,
    }
    this.userService.changePassword(this.data.id, changePasswordBody).subscribe(
      response => this.handleSuccessfulUpdate(formDirective),
      errorResponse => this.handleErrorUpdate()
    );
  }

  private handleSuccessfulUpdate(formDirective: FormGroupDirective): void {
    this.toggleIsLoading(false);
    const credentialForm = this.changePasswordForm.controls.credential;
    credentialForm.enable();
    this.changePasswordForm.reset();
    formDirective.resetForm();
    this.toastrService.success('เปลี่ยนรหัสผ่านสำเร็จ');
  }

  private handleErrorUpdate(): void {
    this.toggleIsLoading(false);
    const credentialForm = this.changePasswordForm.controls.credential;
    credentialForm.enable();
    this.toastrService.warning('เปลี่ยนรหัสผ่านไม่สำเร็จ');
  }

  private toggleIsLoading(state: boolean) {
    this.isLoading = state;
    this.isLoadingChange.emit(this.isLoading);
  }

}
