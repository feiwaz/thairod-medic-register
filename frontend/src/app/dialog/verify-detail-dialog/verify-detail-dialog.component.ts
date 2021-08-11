import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { VerificationBody } from 'src/app/model/verification-body.model';
import { AuthenticationService } from 'src/app/service/authentication.service';
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
  status = {
    PENDING: 'รอการอนุมัติ',
    APPROVED: 'อนุมัติแล้ว',
    DENIED: 'ไม่อนุมัติ'
  };
  content: any;

  verifyForm = this.fb.group({
    note: ['']
  });

  constructor(
    private fb: FormBuilder,
    private volunteerService: VolunteerService,
    private doctorService: DoctorService,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private toastrService: ToastrService,
    private authService: AuthenticationService,
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
    this.isLoading = true;
    const service = this.role === 'doctor' ? this.doctorService : this.volunteerService;
    service.updateStatus(content.id, this.buildRequestBody(status)).subscribe(
      response => this.handleSuccessfulUpdate(content, status),
      errorResponse => this.handleErrorUpdate()
    );
  }

  buildRequestBody(status: string): VerificationBody {
    return {
      status,
      verifiedById: +this.authService.currentUser.id,
      statusNote: this.verifyForm.controls.note.value ? this.verifyForm.controls.note.value : null
    };
  }

  private handleSuccessfulUpdate(content: any, status: string) {
    this.isLoading = false;
    this.verifyForm.enable();
    this.dialogRef.close({
      success: true,
      fullName: `${content.initial} ${content.firstName} ${content.lastName}`,
      role: this.role,
      status
    });
  }

  private handleErrorUpdate(): void {
    this.isLoading = false;
    this.verifyForm.enable();
    this.toastrService.warning('ทำรายการไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
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
