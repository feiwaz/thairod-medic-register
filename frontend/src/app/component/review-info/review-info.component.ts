import { HttpEventType, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ActivatedRoute, Router } from '@angular/router';
import liff from '@line/liff';
import { ToastrService } from 'ngx-toastr';
import { GENDERS } from '../../constant/genders';
import { BasicInfo } from '../../model/basic-info.model';
import { DoctorJobInfo } from '../../model/doctor-job-info.model';
import { VolunteerJobInfo } from '../../model/volunteer-job-info.model';
import { DoctorService } from '../../service/doctor.service';
import { FileService } from '../../service/file.service';
import { VolunteerService } from '../../service/volunteer.service';
import { maskId } from '../../util/util-functions';

interface Upload {
  state: 'pending' | 'progress' | 'done';
  progress: number;
}

@Component({
  selector: 'app-review-info',
  templateUrl: './review-info.component.html',
  styleUrls: ['./review-info.component.scss']
})
export class ReviewInfoComponent implements OnInit {

  readonly defaultSuccessText = 'ส่งข้อมูลสำเร็จ';
  readonly defaultErrorText = 'ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
  upload: Upload = { state: 'pending', progress: 0 };
  role = '';
  isLoading = false;
  errorResponse = false;
  errorMessages: any = [];
  service: DoctorService | VolunteerService = this.volunteerService;
  displaySpecializedFields: string[] = [];

  basicInfo: BasicInfo = {
    nationalId: 0,
    initial: '',
    gender: '',
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
  ) {
    this.route.data.subscribe(data => this.role = data.role || this.role);
  }

  ngOnInit(): void {
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
      const { nationalId, initial, gender, firstName, lastName, dateOfBirth, address,
        contactNumber, lineId, availableTimes } = JSON.parse(basicInfoString) as BasicInfo;
      this.basicInfo = {
        nationalId, initial, gender, firstName, lastName,
        dateOfBirth, address, contactNumber, lineId, availableTimes
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
    this.upload.progress = 0;
    this.errorResponse = false;
    this.getLineProfile();
  }

  private async getLineProfile() {
    await liff.ready;
    const userProfile = await liff.getProfile();
    const lineUserId = userProfile.userId;
    // const email = liff.getDecodedIDToken()?.email;
    this.basicInfo.lineUserId = lineUserId;
    this.createEntity();
  }

  private createEntity() {
    this.service.create({ ...this.basicInfo, ...this.jobInfo }, this.imageBlobs).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.upload.state = 'progress';
          this.upload.progress = Math.round(100 * event.loaded / (event.total ?? 0));
        } else if (event.type === HttpEventType.Response) {
          this.handleSuccessfulCreateUser();
        }
      },
      errorResponse => this.handleErrorResponse(errorResponse)
    );
  }

  handleSuccessfulCreateUser(): void {
    this.isLoading = false;
    this.upload.state = 'done';
    this.fileService.clearSessionAndImageLocalStorage();
    this.toastrService.success(this.defaultSuccessText);
    const maskedId = maskId(this.basicInfo.nationalId);
    const data = { maskedId, status: this.defaultSuccessText };
    this.router.navigate(['/update-status'], { state: { data } });
  }

  handleErrorResponse(errorResponse: any): void {
    this.isLoading = false;
    this.upload.state = 'done';
    this.upload.progress = 0;
    this.errorResponse = true;
    let errorText = this.defaultErrorText;
    if (Array.isArray(errorResponse.error.message)) {
      if (errorResponse.error.statusCode === HttpStatusCode.Conflict) {
        this.errorMessages = errorResponse.error.message;
      } else {
        if (errorResponse.error.message[0].includes('lineUserId')) {
          errorText = 'ท่านยังไม่ได้เข้าสู้ระบบด้วยไลน์ กรุณาลองใหม่อีกครั้ง';
        }
      }
    }
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

  getGenderViewValue(value = 'Male'): string {
    return (GENDERS.find(item => item.value === value) || GENDERS[0]).viewValue;
  }

}
