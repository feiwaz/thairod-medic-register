import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicInfo } from 'src/app/model/basic-info';
import { JobInfo } from 'src/app/model/job-info';
import { UserService } from 'src/app/service/user.service';
import { maskId } from 'src/app/util/util-functions';

@Component({
  selector: 'app-review-info',
  templateUrl: './review-info.component.html',
  styleUrls: ['./review-info.component.scss']
})
export class ReviewInfoComponent implements OnInit {

  role = '';
  isLoading = false;

  basicInfo: BasicInfo = {
    userId: 0,
    initial: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    contactNumber: '',
    lineId: ''
  };

  jobInfo: JobInfo = {
    specializedFields: [],
    medLicenseId: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.role = data.role || this.role);

    let basicInfoString = sessionStorage.getItem('basicInfo');
    if (basicInfoString) {
      const { userId, initial, firstName, lastName, dateOfBirth,
        address, contactNumber, lineId } = JSON.parse(basicInfoString);
      this.basicInfo = {
        userId, initial, firstName, lastName, dateOfBirth,
        address, contactNumber, lineId
      };
    }

    let jobInfoString = sessionStorage.getItem('jobInfo');
    if (jobInfoString) {
      const { specializedFields, medLicenseId } = JSON.parse(jobInfoString);
      this.jobInfo = { specializedFields, medLicenseId };
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    this.userService.createUser('1111122222333', '').subscribe(
      response => this.handleSuccessfulCreateUser(),
      errorResponse => this.handleErrorResponse()
    );
  }

  handleSuccessfulCreateUser(): void {
    this.isLoading = false;
    const maskedId = maskId(this.basicInfo.userId);
    this.router.navigate([`/update-status`], {
      state: {
        id: maskedId,
        status: 'successfully submitted'
      }
    });
  }
  handleErrorResponse(): void {
    this.isLoading = false;
    throw new Error('handleErrorResponse method not implemented.');
  }

  onEditInfo(path = 'basic-info'): void {
    this.router.navigate([`/${this.role}/${path}`], {
      state: { basicInfo: this.basicInfo, jobInfo: this.jobInfo }
    });
  }

}
