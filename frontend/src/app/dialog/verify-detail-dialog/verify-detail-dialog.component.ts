import { HttpStatusCode } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { GENDERS } from '../../constant/genders';
import { VerificationBody } from '../../model/verification-body.model';
import { AuthenticationService } from '../../service/authentication.service';
import { DoctorService } from '../../service/doctor.service';
import { VolunteerService } from '../../service/volunteer.service';
import { maskId } from '../../util/util-functions';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';

@Component({
  selector: 'app-verify-detail-dialog',
  templateUrl: './verify-detail-dialog.component.html',
  styleUrls: ['./verify-detail-dialog.component.scss']
})
export class VerifyDetailDialogComponent implements OnInit {

  role: 'doctor' | 'volunteer' = 'doctor';
  service: DoctorService | VolunteerService = this.doctorService;
  isLoading = false;
  status = {
    PENDING: 'รอการอนุมัติ',
    APPROVED: 'อนุมัติแล้ว',
    DENIED: 'ไม่อนุมัติ'
  };
  content: { [key: string]: any } = {
    nationalId: '',
    initial: '',
    gender: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    createdTime: '',
    address: '',
    contactNumber: '',
    specializedFields: [],
    departments: [],
    medCertificateId: '',
    idCardImg: '' as any,
    idCardSelfieImg: '' as any,
    jobCertificateImg: '' as any,
    jobCertificateSelfieImg: '' as any,
    availableTimes: '',
    status: '',
    verification: {} as any,
    plainBlobUrl: {
      idCardImg: '',
      idCardSelfieImg: '',
      jobCertificateImg: '',
      jobCertificateSelfieImg: ''
    }
  };

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
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { row?: any, role: 'doctor' | 'volunteer' }
  ) { }

  ngOnInit(): void {
    if (this.data) {
      if (this.data.role) {
        this.role = this.data.role;
        this.service = this.data.role === 'doctor' ? this.doctorService : this.volunteerService;
      }
      if (this.data.row) {
        this.getEntity();
      }
    }
  }

  private getEntity() {
    this.isLoading = true;
    this.service.findOne(this.data.row.id).subscribe(
      response => this.handleSuccessfulFindOne(response),
      errorResponse => this.isLoading = false
    );
  }

  private handleSuccessfulFindOne(response: any): void {
    const { idCardImg, idCardSelfieImg, jobCertificateImg, jobCertificateSelfieImg, ...rest } = response;
    this.content = rest;
    this.content.gender = GENDERS.find(gender => gender.value === this.content.gender)?.viewValue;
    const findAllFiles$ = this.buildFindAllFiles$({ idCardImg, idCardSelfieImg, jobCertificateImg, jobCertificateSelfieImg });
    findAllFiles$.subscribe(
      blobUrls => this.handleSuccessfulFindAllFiles(blobUrls as [string, string, string, string]),
      errorResponse => {
        this.isLoading = false;
        if (errorResponse.status === HttpStatusCode.BadGateway) {
          this.toastrService.warning('ไม่สามารถเชื่อมต่อไฟล์เซิร์ฟเวอร์ได้ในขณะนี้');
        }
      }
    );
  }

  private buildFindAllFiles$(filePaths: { idCardImg: string, idCardSelfieImg: string, jobCertificateImg: string, jobCertificateSelfieImg: string }) {
    const findAllFiles$: any[] = [];
    Object.values(filePaths).forEach(filePath => findAllFiles$.push(this.service.findOneFile(filePath)));
    return forkJoin(findAllFiles$);
  }

  private handleSuccessfulFindAllFiles(blobUrls: [string, string, string, string]) {
    this.isLoading = false;
    const [idCardImg, idCardSelfieImg, jobCertificateImg, jobCertificateSelfieImg] = blobUrls;
    this.content.plainBlobUrl = { idCardImg, idCardSelfieImg, jobCertificateImg, jobCertificateSelfieImg };
    Object.entries(this.content.plainBlobUrl).forEach(
      ([key, value]) => this.content[key] = this.bypassSecurityTrustUrl(value as string)
    );
  }

  private bypassSecurityTrustUrl(blobUrl: string): any {
    return blobUrl ? this.sanitizer.bypassSecurityTrustUrl(blobUrl) : '';
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

  onImageClick(blobUrl: string): void {
    const aElement = document.createElement('a');
    aElement.setAttribute('href', blobUrl);
    aElement.setAttribute('target', '_blank');
    aElement.click();
  }

  onGetEntity(): void {
    this.getEntity();
  }

  getDepartmentLabels(departments: any[]): string {
    return departments.map(department => department.label).join(', ');
  }

  getRequiredTrainingDepartments(departments: any[]): string {
    return departments
      .filter(department => department.isTrainingRequired === true)
      .map(department => department.label).join(', ');
  }

}
