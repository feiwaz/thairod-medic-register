import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DEPARTMENTS } from 'src/app/constant/departments';
import { VolunteerJobInfo } from 'src/app/model/volunteer-job-info';

@Component({
  selector: 'app-volunteer-job-info-form',
  templateUrl: './volunteer-job-info-form.component.html',
  styleUrls: ['./volunteer-job-info-form.component.scss'],
})
export class VolunteerJobInfoFormComponent implements OnInit {

  role = 'volunteer';
  isEditing = false;
  jobInfo: VolunteerJobInfo = {
    departments: [],
    medCertificateId: 0
  };

  departments = DEPARTMENTS;

  jobInfoForm = this.fb.group({
    department1: [{ value: true, disabled: true }],
    department2: false,
    department3: false,
    department4: false,
    department5: false,
    department6: false,
    department7: false,
    department8: false,
    department9: false,
    department10: false,
    department11: false,
    medCertificateId: ['', [Validators.min(10000), Validators.max(99999)]],
    idCard: ['']
  });

  constructor(
    private fb: FormBuilder,
    private router: Router
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
      const { departments, medCertificateId } = JSON.parse(jobInfoString) as VolunteerJobInfo;
      this.jobInfoForm.patchValue({ departments, medCertificateId });

      if (departments.length !== 0) {
        departments.forEach((viewValue: string) => {
          this.departments
            .filter(department => department.viewValue === viewValue)
            .map(department => this.jobInfoForm.controls[department.formControlName].setValue(true));
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
      this.router.navigate([`/${this.role}/job-info`]);
    }
  }

  buildJobInfo(): VolunteerJobInfo {
    const departments = this.buildDepartments();
    const medCertificateId = this.jobInfoForm.controls.medCertificateId.value;
    let jobInfo = { departments } as VolunteerJobInfo;
    if (medCertificateId) {
      jobInfo.medCertificateId = medCertificateId;
    }
    return jobInfo;
  }

  buildDepartments() {
    return this.departments.reduce((result, department) => {
      if (this.jobInfoForm.controls[department.formControlName].value === true) {
        result.push(department.viewValue);
      }
      return result;
    }, [] as any);
  }

  filterType(isOnline = true) {
    return this.departments.filter(department => department.isOnline === isOnline);
  }
}
