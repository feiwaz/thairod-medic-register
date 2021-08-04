import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SPECIALIZED_FIELDS } from 'src/app/constant/specialized-fields';
import { DoctorJobInfo } from 'src/app/model/doctor-job-info';

@Component({
  selector: 'app-doctor-job-info-form',
  templateUrl: './doctor-job-info-form.component.html',
  styleUrls: ['./doctor-job-info-form.component.scss']
})
export class DoctorJobInfoFormComponent implements OnInit {

  role = 'doctor';
  isEditing = false;
  jobInfo: DoctorJobInfo = {
    specializedFields: [],
    medCertificateId: 0
  };

  specializedFields = SPECIALIZED_FIELDS;

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
    private router: Router,
  ) {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation) {
      this.isEditing = currentNavigation.extras.state?.isEditing || false;
    }
  }

  ngOnInit(): void {
    this.patchValue();
  }

  private patchValue() {
    let jobInfoString = sessionStorage.getItem(`${this.role}JobInfo`);
    if (jobInfoString) {
      const { specializedFields, medCertificateId } = JSON.parse(jobInfoString) as DoctorJobInfo;
      this.jobInfoForm.patchValue({ specializedFields, medCertificateId });

      if (specializedFields.length !== 0) {
        specializedFields.forEach((viewValue: string) => {
          this.specializedFields
            .filter(specializedField => specializedField.viewValue === viewValue)
            .map(specializedField => this.jobInfoForm.controls[specializedField.formControlName].setValue(true));
        });
      }
    }
  }

  onSubmit(): void {
    const jobInfo = this.buildJobInfo();
    sessionStorage.setItem(`${this.role}JobInfo`, JSON.stringify(jobInfo));
    if (this.isEditing) {
      this.router.navigate([`/${this.role}/review-info`]);
    } else {
      this.router.navigate([`/${this.role}/available-time`]);
    }
  }

  buildJobInfo(): DoctorJobInfo {
    const specializedFields = this.buildSpecializedFields();
    return {
      specializedFields,
      medCertificateId: this.jobInfoForm.controls.medCertificateId.value
    }
  }

  buildSpecializedFields() {
    return this.specializedFields.reduce((result, specializedField) => {
      if (this.jobInfoForm.controls[specializedField.formControlName].value === true) {
        result.push(specializedField.viewValue);
      }
      return result;
    }, [] as any);
  }

}
