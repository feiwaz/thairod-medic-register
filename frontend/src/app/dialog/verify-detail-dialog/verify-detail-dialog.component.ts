import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DoctorService } from 'src/app/service/doctor.service';
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
    console.log('status', status)
    const service = role === 'doctor' ?
      this.doctorService.updateStatus(content.id, status) :
      this.volunteerService.updateStatus(content.id, status);
    let res = {
      name: `${content.initial}${content.firstName} ${content.lastName}`,
      role,
      status
    };
    service.subscribe(
      response => {
        this.dialogRef.close({success: true,...res})
      },
      errorResponse => {
        this.dialogRef.close({success: false,...res})
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
