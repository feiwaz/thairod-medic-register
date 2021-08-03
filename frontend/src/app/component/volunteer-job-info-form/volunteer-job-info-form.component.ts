import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DEPARTMENTS } from 'src/app/constant/departments';
import { VolunteerJobInfo } from 'src/app/model/volunteer-job-info';

interface departmentCheckbox {
  formControlName: string;
  viewValue: string;
  isOnline: boolean;
}

@Component({
  selector: 'app-volunteer-job-info-form',
  templateUrl: './volunteer-job-info-form.component.html',
  styleUrls: ['./volunteer-job-info-form.component.scss'],
})
export class VolunteerJobInfoFormComponent implements OnInit {
  role = '';
  jobInfo: VolunteerJobInfo = {
    departments: [],
    medCertificateId: 0,
  };

  departments: departmentCheckbox[] = DEPARTMENTS;

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
    idCard: [''],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => (this.role = data.role || this.role));
    this.patchValue();
  }

  private patchValue() {
    let jobInfoString = sessionStorage.getItem('jobInfo');
    if (jobInfoString) {
      const { departments, medCertificateId } = JSON.parse(
        jobInfoString
      ) as VolunteerJobInfo;
      this.jobInfoForm.patchValue({ departments, medCertificateId });

      if (departments.length !== 0) {
        departments.forEach((viewValue: string) => {
          this.departments
            .filter((department) => department.viewValue === viewValue)
            .map((department) =>
              this.jobInfoForm.controls[department.formControlName].setValue(
                true
              )
            );
        });
      }
    }
  }

  onSubmit(): void {
    const jobInfo = this.buildJobInfo();
    sessionStorage.setItem(`${this.role}JobInfo`, JSON.stringify(jobInfo));
    this.router.navigate([`/${this.role}/available-time`]);
  }

  buildJobInfo(): VolunteerJobInfo {
    const departments = this.buildDepartments();
    return {
      departments,
      medCertificateId: this.jobInfoForm.controls.medCertificateId.value,
    };
  }

  buildDepartments() {
    return this.departments.reduce((result, department) => {
      if (
        this.jobInfoForm.controls[department.formControlName].value === true
      ) {
        result.push(department.viewValue);
      }
      return result;
    }, [] as any);
  }

  filterType(
    departments: departmentCheckbox[],
    isOnline: boolean
  ): departmentCheckbox[] {
    return departments.filter(
      (department: departmentCheckbox) => department.isOnline == isOnline
    );
  }
}
