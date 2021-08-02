import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicInfo } from 'src/app/model/basic-info';
import { DoctorJobInfo } from 'src/app/model/doctor-job-info';
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
    id: 0,
    initial: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    contactNumber: '',
    lineId: ''
  };

  jobInfo: DoctorJobInfo = {
    specializedFields: [],
    medCertificateId: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private volunteerService: VolunteerService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.role = data.role || this.role);
    this.service = this.role === 'doctor' ? this.doctorService : this.volunteerService;
    this.initiateFields();
  }

  private initiateFields() {
    let basicInfoString = sessionStorage.getItem('basicInfo');
    if (basicInfoString) {
      const { id, initial, firstName, lastName, dateOfBirth,
        address, contactNumber, lineId } = JSON.parse(basicInfoString);
      this.basicInfo = {
        id, initial, firstName, lastName, dateOfBirth,
        address, contactNumber, lineId
      };
    }
    let jobInfoString = sessionStorage.getItem('jobInfo');
    if (jobInfoString) {
      const { specializedFields, medCertificateId } = JSON.parse(jobInfoString);
      this.jobInfo = { specializedFields, medCertificateId };
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorResponse = false;
    this.service.create({ ...this.basicInfo, ...this.jobInfo }).subscribe(
      response => this.handleSuccessfulCreateUser(),
      errorResponse => this.handleErrorResponse()
    );
  }

  handleSuccessfulCreateUser(): void {
    this.isLoading = false;
    sessionStorage.clear();
    const maskedId = maskId(this.basicInfo.id);
    this.router.navigate([`/update-status`], {
      state: {
        id: maskedId,
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
      state: { basicInfo: this.basicInfo, jobInfo: this.jobInfo }
    });
  }

}
