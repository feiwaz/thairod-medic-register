import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BasicInfo } from 'src/app/model/basic-info';
import { VolunteerJobInfo } from 'src/app/model/volunteer-job-info';
import { DoctorService } from 'src/app/service/doctor.service';
import { UserService } from 'src/app/service/user.service';
import { VolunteerService } from 'src/app/service/volunteer.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-verify-detail-dialog',
  templateUrl: './verify-detail-dialog.component.html',
  styleUrls: ['./verify-detail-dialog.component.scss']
})
export class VerifyDetailDialogComponent implements OnInit {

  role: 'doctor' | 'volunteer' = 'doctor';
  isLoading = false;
  isCreatingNew = false;
  errorMessage = 'Please try again later';
  status = {
    PENDING: 'รอการอนุมัติ',
    APPROVED: 'อนุมัติแล้ว',
    DENIED: 'ไม่อนุมัติ'
  };
  content: any;

  constructor(
    private volunteerService: VolunteerService,
    private doctorService: DoctorService,
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
    if (this.role && content) {
      this.updateStatus(content, this.role, this.status.DENIED)
    }

  }

  onClickVerify(content: any) {
    if (this.role && content) {
      this.updateStatus(content, this.role, this.status.APPROVED);
    }
  }

  updateStatus(content: any, role: 'doctor' | 'volunteer', status: string) {
    const service = role === 'doctor' ?
      this.doctorService.updateStatus(content.id, status) :
      this.volunteerService.updateStatus(content.id, status);

    service.subscribe(
      response => {
        this.dialogRef.close({
          success: true,
          id: content.id,
          role,
          status
        })
      },
      errorResponse => {
        this.dialogRef.close({
          success: false,
          id: content.id,
          role,
          status
        })
      }
    );
  }

  get specializedFields(): string[] {
    return this.content.specializedFields.map((field: { label: string }) => field.label);
  }

  get volunteerDepartments(): string[] {
    return this.content.volunteerDepartments.map((dep: { departmentId: string }) => dep.departmentId);
  }

}
