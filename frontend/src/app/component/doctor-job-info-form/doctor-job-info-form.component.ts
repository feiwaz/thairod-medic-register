import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorJobInfo } from 'src/app/model/doctor-job-info';

interface medFieldCheckbox {
  formControlName: string;
  viewValue: string;
}

@Component({
  selector: 'app-doctor-job-info-form',
  templateUrl: './doctor-job-info-form.component.html',
  styleUrls: ['./doctor-job-info-form.component.scss']
})
export class DoctorJobInfoFormComponent implements OnInit {

  role = '';

  jobInfo: DoctorJobInfo = {
    specializedFields: [],
    medLicenseId: 0
  };

  medFields: medFieldCheckbox[] = [
    { formControlName: 'field1', viewValue: 'สาขาหนึ่ง' },
    { formControlName: 'field2', viewValue: 'สาขาสอง' },
    { formControlName: 'field3', viewValue: 'สาขาสาม' },
    { formControlName: 'field4', viewValue: 'สาขาสี่' },
    { formControlName: 'field5', viewValue: 'สาขาห้า' },
    { formControlName: 'field6', viewValue: 'สาขาหก' },
    { formControlName: 'field7', viewValue: 'สาขาเจ็ด' },
    { formControlName: 'field8', viewValue: 'สาขาแปด' }
  ];

  jobInfoForm = this.fb.group({
    field1: false, field2: false, field3: false, field4: false,
    field5: false, field6: false, field7: false, field8: false,
    medLicenseId: ['', [
      Validators.required,
      Validators.min(10000),
      Validators.max(99999)
    ]],
    idCard: ['']
  });

  constructor(
    private fb: FormBuilder,
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

  buildJobInfo(): DoctorJobInfo {
    const specializedFields = this.buildSpecializedFields();
    return {
      specializedFields,
      medLicenseId: this.jobInfoForm.controls.medLicenseId.value
    }
  }

  buildSpecializedFields() {
    return this.medFields.reduce((result, medField) => {
      if (this.jobInfoForm.controls[medField.formControlName].value === true) {
        result.push(medField.viewValue);
      }
      return result;
    }, [] as any);
  }

}
