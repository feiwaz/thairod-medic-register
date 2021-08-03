import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  isLoading = false;
  isCreatingNew = false;
  errorMessage = 'Please try again later';
  roleOptions: { value: number, viewValue: string }[] = [];

  userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    confirmPassword: [''],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    contactNumber: ['', Validators.required],
    role: [0, Validators.required],
    isActive: [true, Validators.required]
  });

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { row?: User }
  ) { }

  ngOnInit(): void {
    if (!this.data || !this.data.row) {
      this.isCreatingNew = true;
    } else {
      this.initUpdateForm();
    }
  }

  private initUpdateForm(): void {
    const { _id, firstName, lastName, email, role, contactNumber, isActive } = this.data.row as User;
    this.userForm.patchValue({ _id, firstName, lastName, email, role, contactNumber, isActive });
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

  private buildRequestBody(): User {
    return {
      firstName: this.userForm.controls.firstName.value,
      lastName: this.userForm.controls.lastName.value,
      email: this.userForm.controls.email.value,
      contactNumber: this.userForm.controls.contactNumber.value,
      isActive: this.userForm.controls.isActive.value,
      password: this.userForm.controls.password.value,
      role: 'user'
    };
  }

  private createUser(): void {
    this.userService.createUser(this.buildRequestBody()).subscribe(
      response => this.handleSuccessfulUpdate(this.userForm, (response as User).email),
      errorResponse => this.handleErrorUpdate(this.userForm, errorResponse)
    );
  }

  private updateUser(): void {
    this.userService.updateUser(this.data.row?._id as string, this.buildRequestBody()).subscribe(
      response => this.handleSuccessfulUpdate(this.userForm, this.data.row?._id, response as User),
      errorResponse => this.handleErrorUpdate(this.userForm, errorResponse)
    );
  }

  private handleSuccessfulUpdate(formGroup: FormGroup, entityId?: string, user?: User): void {
    this.isLoading = false;
    formGroup.enable();
    this.dialogRef.close({
      success: true,
      isCreatingNew: this.isCreatingNew,
      entityId,
      user
    });
  }

  private handleErrorUpdate(formGroup: FormGroup, errorResponse: any): void {
    this.isLoading = false;
    formGroup.enable();
    this.toastrService.warning(errorResponse?.error?.error?.message);
  }

}
