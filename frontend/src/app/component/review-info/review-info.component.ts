import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasicInfo } from 'src/app/model/basic-info';
import { DoctorJobInfo } from 'src/app/model/doctor-job-info';
import { VolunteerJobInfo } from 'src/app/model/volunteer-job-info';
import { DoctorService } from 'src/app/service/doctor.service';
import { FileService } from 'src/app/service/file.service';
import { VolunteerService } from 'src/app/service/volunteer.service';
import { maskId } from 'src/app/util/util-functions';

@Component({
  selector: 'app-review-info',
  templateUrl: './review-info.component.html',
  styleUrls: ['./review-info.component.scss']
})
export class ReviewInfoComponent implements OnInit {

  readonly defaultErrorText = 'ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
  role = '';
  isLoading = false;
  errorResponse = false;
  service: DoctorService | VolunteerService = this.volunteerService;
  displaySpecializedFields: string[] = [];

  basicInfo: BasicInfo = {
    nationalId: 0,
    initial: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    contactNumber: '',
    lineId: '',
    availableTimes: []
  };

  jobInfo: any = {
    specializedFields: [],
    medCertificateId: 0,
    departments: []
  };

  passImageRequirement = false;
  imageBlobs: Blob[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private volunteerService: VolunteerService,
    private sanitizer: DomSanitizer,
    private fileService: FileService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.role = data.role || this.role);
    this.service = this.role === 'doctor' ? this.doctorService : this.volunteerService;
    this.fileService.getFilesByBlobUrl()
      .then(blobs => this.imageBlobs = blobs)
      .finally(() => this.initiateFields());
  }

  private initiateFields() {
    this.patchBasicInfo();
    this.patchJobInfo();
    this.checkIfPassImageRequirement();
  }

  private patchBasicInfo() {
    let basicInfoString = sessionStorage.getItem(`${this.role}BasicInfo`);
    if (basicInfoString) {
      const { nationalId, initial, firstName, lastName, dateOfBirth, address,
        contactNumber, lineId, availableTimes } = JSON.parse(basicInfoString) as BasicInfo;
      this.basicInfo = {
        nationalId, initial, firstName, lastName, dateOfBirth,
        address, contactNumber, lineId, availableTimes
      };
    }
  }

  private patchJobInfo() {
    let jobInfoString = sessionStorage.getItem(`${this.role}JobInfo`);
    if (jobInfoString) {
      if (this.role === 'doctor') {
        const { specializedFields, medCertificateId } = JSON.parse(jobInfoString);
        this.jobInfo = { specializedFields, medCertificateId: +medCertificateId } as DoctorJobInfo;
      } else {
        const { departments, medCertificateId } = JSON.parse(jobInfoString);
        this.jobInfo = { departments, medCertificateId: +medCertificateId } as VolunteerJobInfo;
      }
    }
  }

  private checkIfPassImageRequirement() {
    this.passImageRequirement = this.role === 'doctor'
      ? this.imageBlobs[0] != null && this.imageBlobs[1] != null && this.imageBlobs[2] != null && this.imageBlobs[3] != null
      : this.imageBlobs[0] != null && this.imageBlobs[1] != null;
  }

  getBlobUrl(key: string): SafeUrl {
    let blobUrl = '';
    const cachedObject = localStorage.getItem(key);
    if (cachedObject) {
      let cachedImage
      try {
        cachedImage = JSON.parse(cachedObject);
        blobUrl = cachedImage.blobUrl;
      } catch (error) {
        console.warn(`Cannot get blob url for: ${key}`);
      }
    }
    return blobUrl ? this.sanitizer.bypassSecurityTrustUrl(blobUrl) : blobUrl;
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorResponse = false;
    this.service.create({ ...this.basicInfo, ...this.jobInfo }, this.imageBlobs).subscribe(
      response => this.handleSuccessfulCreateUser(),
      errorResponse => this.handleErrorResponse(errorResponse)
    );
  }

  handleSuccessfulCreateUser(): void {
    this.isLoading = false;
    this.fileService.clearSessionAndImageLocalStorage();
    this.toastrService.success('ส่งข้อมูลสำเร็จ');
    const maskedId = maskId(this.basicInfo.nationalId);
    this.router.navigate(['/update-status'], {
      state: {
        nationalId: maskedId,
        status: 'ส่งข้อมูลสำเร็จ'
      }
    });
  }

  handleErrorResponse(errorResponse: any): void {
    this.isLoading = false;
    this.errorResponse = true;
    let errorText = this.defaultErrorText;
    if (errorResponse.error.statusCode === HttpStatusCode.BadGateway) {
      errorText = 'ไม่สามารถอัพโหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง'
    }
    this.toastrService.warning(errorText);
  }

  onEditInfo(path = 'basic-info'): void {
    this.router.navigate([`/${this.role}/${path}`], {
      state: { isEditing: true }
    });
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

}
