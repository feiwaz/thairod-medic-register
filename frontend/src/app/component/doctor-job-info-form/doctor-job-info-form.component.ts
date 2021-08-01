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
    medCertificateId: 0
  };

  medFields: medFieldCheckbox[] = [
    { formControlName: 'field1', viewValue: 'เวชปฏิบัติทั่วไป' },
    { formControlName: 'field2', viewValue: 'สูตินรีเวช' },
    { formControlName: 'field3', viewValue: 'อายุรกรรม' },
    { formControlName: 'field4', viewValue: 'ศัลยกรรม' },
    { formControlName: 'field5', viewValue: 'กุมารเวช' },
    { formControlName: 'field6', viewValue: 'อื่นๆ' }
  ];

  jobInfoForm = this.fb.group({
    field1: [{ value: true, disabled: true }], field2: false,
    field3: false, field4: false, field5: false, field6: false,
    medCertificateId: ['', [
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
    this.patchValue();
  }

  private patchValue() {
    let jobInfoString = sessionStorage.getItem('jobInfo');
    if (jobInfoString) {
      const { specializedFields, medCertificateId } = JSON.parse(jobInfoString);
      this.jobInfoForm.patchValue({ medCertificateId });

      if (specializedFields.length !== 0) {
        specializedFields.forEach((viewValue: string) => {
          this.medFields
            .filter(medField => medField.viewValue === viewValue)
            .map(medField => this.jobInfoForm.controls[medField.formControlName].setValue(true));
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
      medCertificateId: this.jobInfoForm.controls.medCertificateId.value
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
