import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
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
  }

  onVerifyClicked(content: any, status: string) {
    if (this.role && content) {
      this.updateStatus(content, status);
    }
  }

  updateStatus(content: any, status: string) {
    const service = this.role === 'doctor' ? this.doctorService : this.volunteerService;
    service.updateStatus(content.id, status).subscribe(
      response => this.dialogRef.close({
        success: true,
        fullName: `${content.initial} ${content.firstName} ${content.lastName}`,
        role: this.role
      }),
      errorResponse => this.dialogRef.close({ success: false })
    );
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
