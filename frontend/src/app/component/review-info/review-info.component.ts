import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { BasicInfo } from 'src/app/model/basic-info';
import { DoctorJobInfo } from 'src/app/model/doctor-job-info';
import { VolunteerJobInfo } from 'src/app/model/volunteer-job-info';
import { DoctorService } from 'src/app/service/doctor.service';
import { VolunteerService } from 'src/app/service/volunteer.service';
import { maskId } from 'src/app/util/util-functions';

@Component({
  selector: 'app-review-info',
  templateUrl: './review-info.component.html',
  styleUrls: ['./review-info.component.scss']
})
export class ReviewInfoComponent implements OnInit {

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
    departments: [],
    idCard: null as any,
    idCardSelfie: null as any,
    medCertificate: null as any,
    medCertificateSelfie: null as any
  };

  idCardBlob: SafeUrl = '';
  idCardSelfieBlob: SafeUrl = '';
  medCertificateBlob: SafeUrl = '';
  medCertificateSelfieBlob: SafeUrl = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private volunteerService: VolunteerService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.role = data.role || this.role);
    this.service = this.role === 'doctor' ? this.doctorService : this.volunteerService;
    this.initiateFields();
  }

  private initiateFields() {
    let basicInfoString = sessionStorage.getItem(`${this.role}BasicInfo`);
    if (basicInfoString) {
      const { nationalId, initial, firstName, lastName, dateOfBirth, address,
        contactNumber, lineId, availableTimes } = JSON.parse(basicInfoString) as BasicInfo;
      this.basicInfo = {
        nationalId, initial, firstName, lastName, dateOfBirth,
        address, contactNumber, lineId, availableTimes
      };
    }

    let jobInfoString = sessionStorage.getItem(`${this.role}JobInfo`);
    if (jobInfoString) {
      if (this.role === 'doctor') {
        const { specializedFields, medCertificateId, idCard, idCardSelfie, medCertificate, medCertificateSelfie } = JSON.parse(jobInfoString) as DoctorJobInfo;
        this.jobInfo = { specializedFields, medCertificateId, idCard, idCardSelfie, medCertificate, medCertificateSelfie } as DoctorJobInfo;
      } else {
        const { departments, medCertificateId } = JSON.parse(jobInfoString) as VolunteerJobInfo;
        this.jobInfo = { departments, medCertificateId } as VolunteerJobInfo;
      }
    }
    this.idCardBlob = this.sanitizer.bypassSecurityTrustUrl(this.getBlobUrl('idCard'));
    this.idCardSelfieBlob = this.sanitizer.bypassSecurityTrustUrl(this.getBlobUrl('idCardSelfie'));
    this.medCertificateBlob = this.sanitizer.bypassSecurityTrustUrl(this.getBlobUrl('medCertificate'));
    this.medCertificateSelfieBlob = this.sanitizer.bypassSecurityTrustUrl(this.getBlobUrl('medCertificateSelfie'));
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorResponse = false;
    /* 
      TO DO
      - Need to clarify what data type to be used to upload image  
      - Before sending request to create user, convert blob:url to File or Base64 image
      - Can be done either it in 1) this file 2) this.service or 3) at backend
    */
    this.service.create({ ...this.basicInfo, ...this.jobInfo }).subscribe(
      response => this.handleSuccessfulCreateUser(),
      errorResponse => this.handleErrorResponse()
    );
  }

  handleSuccessfulCreateUser(): void {
    this.isLoading = false;
    sessionStorage.clear();
    const maskedId = maskId(this.basicInfo.nationalId);
    this.router.navigate([`/update-status`], {
      state: {
        nationalId: maskedId,
        status: 'ส่งข้อมูลสำเร็จ'
      }
    });
  }

  handleErrorResponse(): void {
    this.isLoading = false;
    this.errorResponse = true;
  }

  onEditInfo(path = 'basic-info'): void {
    this.router.navigate([`/${this.role}/${path}`], {
      state: { isEditing: true }
    });
  }

  getBlobUrl(id: string): string {
    const cachedObject = localStorage.getItem(id);
    if (cachedObject) {
      const cachedImage = JSON.parse(cachedObject);
      return cachedImage.blobUrl;
    }
    return '';
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

}
