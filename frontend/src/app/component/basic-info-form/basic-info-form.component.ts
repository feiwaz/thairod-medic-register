import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BasicInfo } from 'src/app/model/basic-info';

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

  isEditing = false;
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

  initials: any[] = [
    { value: 1, viewValue: 'นาย' },
    { value: 2, viewValue: 'นางสาว' },
    { value: 3, viewValue: 'นาง' },
    { value: 4, viewValue: 'เด็กชาย' },
    { value: 5, viewValue: 'เด็กหญิง' }
  ];

  basicInfoForm = new FormGroup({
    userId: new FormControl('',
      [Validators.required, Validators.min(1000000000000), Validators.max(9999999999999)]
    ),
    initial: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    dateOfBirth: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    contactNumber: new FormControl('', Validators.required),
    lineId: new FormControl('', Validators.required)
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.role = data.role || this.role);

    let basicInfoString = sessionStorage.getItem('basicInfo');
    if (basicInfoString) {
      const { userId, initial, firstName, lastName, dateOfBirth,
        address, contactNumber, lineId } = JSON.parse(basicInfoString);
      this.basicInfoForm.patchValue({
        userId, initial: this.initials.find(option => option.viewValue === initial).value,
        firstName, lastName, dateOfBirth: moment(dateOfBirth, 'DD/MM/YYYY'),
        address, contactNumber, lineId
      });
    }
  }

  onSubmit(): void {
    const basicInfo = this.buildBasicInfo();
    sessionStorage.setItem('basicInfo', JSON.stringify(basicInfo));
    this.router.navigate([`/${this.role}/job-info`]);
  }

  buildBasicInfo(): BasicInfo {
    return {
      userId: this.basicInfoForm.controls.userId.value,
      initial: this.initials.find(option => option.value === this.basicInfoForm.controls.initial.value).viewValue,
      firstName: this.basicInfoForm.controls.firstName.value,
      lastName: this.basicInfoForm.controls.lastName.value,
      dateOfBirth: this.basicInfoForm.controls.dateOfBirth.value.format('DD/MM/YYYY'),
      address: this.basicInfoForm.controls.address.value,
      contactNumber: this.basicInfoForm.controls.contactNumber.value,
      lineId: this.basicInfoForm.controls.lineId.value
    }
  }

}
