import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicInfo } from 'src/app/model/basic-info';
import { JobInfo } from 'src/app/model/job-info';

@Component({
  selector: 'app-job-info-form',
  templateUrl: './job-info-form.component.html',
  styleUrls: ['./job-info-form.component.scss']
})
export class JobInfoFormComponent implements OnInit {

  role = '';
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

  medFields = [
    { formControlName: 'field1', viewValue: 'สาขาหนึ่ง' },
    { formControlName: 'field2', viewValue: 'สาขาสอง' },
    { formControlName: 'field3', viewValue: 'สาขาสาม' },
    { formControlName: 'field4', viewValue: 'สาขาสี่' },
    { formControlName: 'field5', viewValue: 'สาขาห้า' },
    { formControlName: 'field6', viewValue: 'สาขาหก' },
    { formControlName: 'field7', viewValue: 'สาขาเจ็ด' },
    { formControlName: 'field8', viewValue: 'สาขาแปด' }
  ]

  jobInfoForm = new FormGroup({
    field1: new FormControl(false),
    field2: new FormControl(false),
    field3: new FormControl(false),
    field4: new FormControl(false),
    field5: new FormControl(false),
    field6: new FormControl(false),
    field7: new FormControl(false),
    field8: new FormControl(false),
    medLicenseId: new FormControl('', [
      Validators.required,
      Validators.min(1000000000000),
      Validators.max(9999999999999)
    ])
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.role = data.role || this.role);

    let jobInfoString = sessionStorage.getItem('jobInfo');
    if (jobInfoString) {
      const { specializedFields, medLicenseId } = JSON.parse(jobInfoString);
      this.jobInfoForm.patchValue({ medLicenseId });

      if (specializedFields.length !== 0) {
        specializedFields.forEach((viewValue: string) => {
          this.medFields
            .filter(medField => medField.viewValue === viewValue)
            .map(medField => this.jobInfoForm.controls[medField.formControlName].setValue(true))
        });
      }
    }
  }

  onSubmit(): void {
    const jobInfo = this.buildJobInfo();
    sessionStorage.setItem('jobInfo', JSON.stringify(jobInfo));
    this.router.navigate([`/${this.role}/review-info`]);
  }

  buildJobInfo(): JobInfo {
    const specializedFields = this.buildSpecializedFields();
    return {
      specializedFields,
      medLicenseId: this.jobInfoForm.controls.medLicenseId.value
    }
  }

  buildSpecializedFields() {
    return this.medFields
      .filter(field => this.jobInfoForm.controls[field.formControlName].value === true)
      .map(item => item.viewValue);
  }

}
