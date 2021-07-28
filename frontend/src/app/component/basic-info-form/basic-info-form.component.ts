import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

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

  role = '';
  initials: any[] = [
    { value: '1', viewValue: 'นาย' },
    { value: '2', viewValue: 'นางสาว' },
    { value: '3', viewValue: 'นาง' },
    { value: '4', viewValue: 'เด็กชาย' },
    { value: '5', viewValue: 'เด็กหญิง' }
  ];

  basicInfoForm = new FormGroup({
    userId: new FormControl({ value: '', disabled: false },
      [Validators.required, Validators.min(1000000000000), Validators.max(9999999999999)]
    ),
    initial: new FormControl({ value: '', disabled: false }, Validators.required),
    firstName: new FormControl({ value: '', disabled: false }, Validators.required),
    lastName: new FormControl({ value: '', disabled: false }, Validators.required),
    date: new FormControl({ value: moment(), disabled: false }, Validators.required),
    address: new FormControl({ value: '', disabled: false }, Validators.required),
    contactNumber: new FormControl({ value: '', disabled: false }, Validators.required),
    lineId: new FormControl({ value: '', disabled: false }, Validators.required)
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data.role) this.role = data.role;
    });
  }

  onSubmit(): void {
    this.router.navigate([`/${this.role}/job-info`]);
  }

}
