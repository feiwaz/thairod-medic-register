import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/user.model';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';
import { CustomValidators } from 'src/app/util/custom-validators';
import { numbersOnly} from 'src/app/util/util-functions';
@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  isLoading = false;
  isCreatingNew = false;
  hidePassword = true;
  hideConfirmPassword = true;
  errorMessage = 'Please try again later';

  roleOptions: { value: string, viewValue: string }[] = [
    { value: 'user', viewValue: 'ผู้ตรวจสอบ' },
    { value: 'admin', viewValue: 'แอดมิน' }
  ];

  userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    contactNumber: ['', Validators.required],
    role: ['user', Validators.required]
  });

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private authService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: { row?: User }
  ) { }

  ngOnInit(): void {
    if (!this.data || !this.data.row) {
      this.isCreatingNew = true;
      this.addFormForNewUser();
    } else {
      this.initUpdateForm();
    }
  }

  private addFormForNewUser() {
    this.userForm.addControl('isActive', this.fb.control(true, Validators.required));
    const credentialForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', Validators.required)
    }, CustomValidators.compareConfirmPassword);
    this.userForm.addControl('credential', credentialForm);
  }

  private initUpdateForm(): void {
    const { id, firstName, lastName, email, role, contactNumber } = this.data.row as User;
    this.userForm.patchValue({ id, firstName, lastName, email, role, contactNumber });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.userForm.disable();

    if (this.isCreatingNew) {
      this.createUser();
    } else {
      if (this.userForm.dirty) {
        this.updateUser();
      }
    }
  }

  private buildCommonBody(): User {
    return {
      email: this.userForm.controls.email.value,
      firstName: this.userForm.controls.firstName.value,
      lastName: this.userForm.controls.lastName.value,
      contactNumber: this.userForm.controls.contactNumber.value,
      role: 'user'
    };
  }

  private createUser(): void {
    const credentialFormGroup = this.userForm.controls.credential;
    const requestBody = {
      ...this.buildCommonBody(),
      password: credentialFormGroup.get('password')?.value,
      confirmPassword: credentialFormGroup.get('confirmPassword')?.value,
      isActive: this.userForm.controls.isActive.value,
      createdById: this.authService.currentUser.id
    };
    this.userService.createUser(requestBody).subscribe(
      response => this.handleSuccessfulUpdate(),
      errorResponse => this.handleErrorUpdate(errorResponse)
    );
  }

  private updateUser(): void {
    const user = this.data.row;
    const requestBody = {
      ...this.buildCommonBody(),
      isActive: user?.isActive
    };
    this.userService.patchUser(user?.id as string, requestBody).subscribe(
      response => this.handleSuccessfulUpdate(),
      errorResponse => this.handleErrorUpdate(errorResponse)
    );
  }

  private handleSuccessfulUpdate(): void {
    this.isLoading = false;
    this.userForm.enable();
    this.dialogRef.close({
      success: true,
      isCreatingNew: this.isCreatingNew,
      entityId: this.userForm.controls.email.value,
      user: this.data.row
    });
  }

  private handleErrorUpdate(errorResponse: any): void {
    this.isLoading = false;
    this.userForm.enable();
    let warningText = 'ทำรายการไม่สำเร็จ โปรดลองใหม่อีกครั้ง';
    const errorMessage = errorResponse.error.message;
    if (Array.isArray(errorMessage) && errorMessage.includes('email must be an email')) {
      warningText = 'รูปแบบอีเมลไม่ถูกต้อง';
    } else {
      warningText = `${this.userForm.controls.email.value} ${errorMessage}`;
    }
    this.toastrService.warning(warningText);
  }

  inputNumber(event : any) {
    numbersOnly(event)
  }
}
