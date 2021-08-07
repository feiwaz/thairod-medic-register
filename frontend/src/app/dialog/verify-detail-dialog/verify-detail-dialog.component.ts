import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BasicInfo } from 'src/app/model/basic-info';
import { DoctorJobInfo } from 'src/app/model/doctor-job-info';
import { VolunteerJobInfo } from 'src/app/model/volunteer-job-info';
import { UserService } from 'src/app/service/user.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-verify-detail-dialog',
  templateUrl: './verify-detail-dialog.component.html',
  styleUrls: ['./verify-detail-dialog.component.scss']
})
export class VerifyDetailDialogComponent implements OnInit {

  isLoading = false;
  isCreatingNew = false;
  errorMessage = 'Please try again later';
  roleOptions: { value: number, viewValue: string }[] = [
    { value: 0, viewValue: 'ผู้ตรวจสอบ' },
    { value: 1, viewValue: 'แอดมิน' }
  ];


  content!: BasicInfo & VolunteerJobInfo & DoctorJobInfo;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { row?: BasicInfo & VolunteerJobInfo & DoctorJobInfo }
  ) { }
  

  ngOnInit(): void {
    if (this.data && this.data.row) {
      this.content = this.data.row;
    }

    
    console.log('MAT_DIALOG_DATA', this.data)
  }

  onClickReject(content:  BasicInfo & VolunteerJobInfo & DoctorJobInfo) {

  }

  onClickVerify(content:  BasicInfo & VolunteerJobInfo & DoctorJobInfo) {

  }

}
