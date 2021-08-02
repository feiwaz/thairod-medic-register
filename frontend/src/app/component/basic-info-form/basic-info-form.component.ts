import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BasicInfo } from 'src/app/model/basic-info';
import { partialMaskId } from 'src/app/util/util-functions';

export const DATE_FORMAT = {
  parse: {
    dateInput: 'MMM, DD YYYY'
  },
  display: {
    dateInput: 'MMM, DD YYYY',
    monthYearLabel: 'MMM DD YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM DD YYYY'
  }
};

interface InitialOption {
  value: number;
  viewValue: string;
}

const doctorInitials: InitialOption[] = [
  { value: 1, viewValue: 'นายแพทย์' },
  { value: 2, viewValue: 'แพทย์หญิง' },
  { value: 3, viewValue: 'เภสัชกรชาย' },
  { value: 4, viewValue: 'เภสัชกรหญิง' }
];

const volunteerInitials: InitialOption[] = [
  { value: 1, viewValue: 'นาย' },
  { value: 2, viewValue: 'นางสาว' },
  { value: 3, viewValue: 'นาง' },
  { value: 4, viewValue: 'เด็กชาย' },
  { value: 5, viewValue: 'เด็กหญิง' }
];

@Component({
  selector: 'app-basic-info-form',
  templateUrl: './basic-info-form.component.html',
  styleUrls: ['./basic-info-form.component.scss'],
  providers: [{
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  }, {
    provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT
  }]
})
export class BasicInfoFormComponent implements OnInit {

  role = '';
  id = '';
  initials: InitialOption[] = [];

  basicInfoForm = this.fb.group({
    id: ['', Validators.required],
    initial: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    address: ['', Validators.required],
    contactNumber: ['', Validators.required],
    lineId: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.role = data.role || this.role);
    this.initials = this.role === 'doctor' ? doctorInitials : volunteerInitials;
    this.patchValue();
  }

  private patchValue() {
    let basicInfoString = sessionStorage.getItem('basicInfo');
    if (basicInfoString) {
      const { id, initial, firstName, lastName, dateOfBirth, address, contactNumber, lineId } = JSON.parse(basicInfoString);
      this.id = id || this.id;
      this.basicInfoForm.patchValue({
        id: partialMaskId(id),
        initial: this.initials.find(option => option.viewValue === initial)?.value,
        firstName, lastName, dateOfBirth: moment(dateOfBirth, 'DD/MM/YYYY'),
        address, contactNumber, lineId
      });
    }
  }

  onBackToVerifyId(): void {
    sessionStorage.clear();
    this.router.navigate([`/${this.role}/verify-id`]);
  }

  onSubmit(): void {
    const basicInfo = this.buildBasicInfo();
    sessionStorage.setItem('basicInfo', JSON.stringify(basicInfo));
    this.router.navigate([`/${this.role}/job-info`]);
  }

  buildBasicInfo(): BasicInfo {
    return {
      id: +this.id,
      initial: this.initials.find(option => option.value === this.basicInfoForm.controls.initial.value)?.viewValue || '',
      firstName: this.basicInfoForm.controls.firstName.value,
      lastName: this.basicInfoForm.controls.lastName.value,
      dateOfBirth: this.basicInfoForm.controls.dateOfBirth.value.format('DD/MM/YYYY'),
      address: this.basicInfoForm.controls.address.value,
      contactNumber: this.basicInfoForm.controls.contactNumber.value,
      lineId: this.basicInfoForm.controls.lineId.value
    }
  }

}