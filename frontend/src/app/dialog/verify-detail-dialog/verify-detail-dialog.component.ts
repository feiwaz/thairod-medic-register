import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-verify-detail-dialog',
  templateUrl: './verify-detail-dialog.component.html',
  styleUrls: ['./verify-detail-dialog.component.scss']
})
export class VerifyDetailDialogComponent implements OnInit {

  role = 'doctor';
  isLoading = false;
  isCreatingNew = false;
  errorMessage = 'Please try again later';
  roleOptions: { value: number, viewValue: string }[] = [
    { value: 0, viewValue: 'ผู้ตรวจสอบ' },
    { value: 1, viewValue: 'แอดมิน' }
  ];

  content: any;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { row?: any, role: 'doctor' | 'volunteer' }
  ) { }


  ngOnInit(): void {
    if (this.data) {
      if (this.data.row) this.content = this.data.row;
      if (this.data.role) this.role = this.data.role;
    }

    console.log('MAT_DIALOG_DATA', this.data)
  }

  onClickReject(content: any) {

  }

  onClickVerify(content: any) {

  }

  get dateOfBirth(): string {
    return moment(this.content.dateOfBirth).format('DD MMM YYYY');
  }

  get specializedFields(): string[] {
    return this.content.specializedFields.map((field: { label: string }) => field.label);
  }

  get volunteerDepartments(): string[] {
    return this.content.volunteerDepartments.map((dep: any) => dep.department.label);
  }

}
