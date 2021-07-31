import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Role } from 'src/app/model/role.model';
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
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    name: [{ value: '', disabled: true }, [Validators.required]],
    role: [{ value: 0, disabled: true }, [Validators.required]]
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
    }
    this.initRoleOptions();
  }

  private initRoleOptions(): void {
    this.isLoading = true;
    // this.roleService.getRoles().subscribe(
    //   response => this.handleSuccessfulGetRoles(response as Role[]),
    //   errorResponse => this.handleErrorGetRoles()
    // );
  }

  private handleSuccessfulGetRoles(roles: Role[]): void {
    roles.forEach(role => {
      const { value, text } = role;
      this.roleOptions.push({ value, viewValue: text });
    });
    this.isLoading = false;
    this.userForm.enable();
    this.initForm();
  }

  private handleErrorGetRoles(): void {
    this.isLoading = false;
    this.userForm.enable();
  }

  private initForm(): void {
    if (this.data && this.data.row) {
      this.initUpdateForm();
    }
  }

  private initUpdateForm(): void {
    const { _id, email, name, role } = this.data.row as User;
    this.userForm.patchValue({ _id, email, name, role: (role as Role)?.value });
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
      email: this.userForm.controls.email.value,
      name: this.userForm.controls.name.value,
      role: this.userForm.controls.role.value
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
