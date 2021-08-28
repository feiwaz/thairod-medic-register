import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { GENDERS } from '../../constant/genders';
import { DOCTOR_INITIALS, InitialOption, VOLUNTEER_INITIALS } from '../../constant/initials';
import { BasicInfo } from '../../model/basic-info.model';
import { numbersOnly, partialMaskId } from '../../util/util-functions';

@Component({
  selector: 'app-basic-info-form',
  templateUrl: './basic-info-form.component.html',
  styleUrls: ['./basic-info-form.component.scss']
})
export class BasicInfoFormComponent implements OnInit {

  role = '';
  nationalId = '';
  isEditing = false;
  availableTimes: string[] = []
  initials: InitialOption[] = [];
  genders = GENDERS;
  startDate = moment('21/03/1982', 'DD/MM/YYYY');
  minDate = moment().subtract(60, 'year');
  maxDate = moment();
  basicInfoForm = this.fb.group({
    nationalId: ['', Validators.required],
    initial: ['', Validators.required],
    gender: ['', Validators.required],
    firstName: ['', [Validators.required, Validators.pattern(/^[\u0E01-\u0E4E']+$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[\u0E01-\u0E4E']+$/)]],
    dateOfBirth: ['', Validators.required],
    address: ['', Validators.required],
    contactNumber: ['', Validators.required],
    lineId: ['', [Validators.required, Validators.pattern(/^[0-9a-zA-Z.-_]+$/)]],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation) {
      this.isEditing = currentNavigation.extras.state?.isEditing || false;
    }
    this.route.data.subscribe(data => this.role = data.role || this.role);
    this.maxDate = this.maxDate.subtract(this.role === 'doctor' ? 24 : 18, 'year');
  }

  ngOnInit(): void {
    this.initials = this.role === 'doctor' ? DOCTOR_INITIALS : VOLUNTEER_INITIALS;
    this.patchValue();
  }

  private patchValue() {
    let basicInfoString = sessionStorage.getItem(`${this.role}BasicInfo`);
    if (basicInfoString) {
      const { nationalId, initial, gender, firstName, lastName, dateOfBirth, address,
        contactNumber, lineId, availableTimes } = JSON.parse(basicInfoString) as BasicInfo;
      this.nationalId = nationalId + '' || this.nationalId;
      this.availableTimes = availableTimes;
      this.basicInfoForm.patchValue({
        nationalId: partialMaskId(nationalId),
        initial: this.initials.find(option => option.viewValue === initial)?.value,
        gender, firstName, lastName, dateOfBirth: moment(dateOfBirth),
        address, contactNumber, lineId
      });
    }
  }

  onBackToVerifyId(): void {
    this.router.navigate([`/${this.role}/verify-id`]);
  }

  inputNumber(event: any) {
    numbersOnly(event)
  }

  onSubmit(): void {
    const basicInfo = this.buildBasicInfo();
    sessionStorage.setItem(`${this.role}BasicInfo`, JSON.stringify(basicInfo));
    if (this.isEditing) {
      this.router.navigate([`/${this.role}/review-info`]);
    } else {
      this.router.navigate([`/${this.role}/job-info`]);
    }
  }

  buildBasicInfo(): BasicInfo {
    return {
      nationalId: +this.nationalId,
      initial: this.initials.find(option => option.value === this.basicInfoForm.controls.initial.value)?.viewValue || '',
      gender: this.basicInfoForm.controls.gender.value,
      firstName: this.basicInfoForm.controls.firstName.value,
      lastName: this.basicInfoForm.controls.lastName.value,
      dateOfBirth: this.basicInfoForm.controls.dateOfBirth.value,
      address: this.basicInfoForm.controls.address.value,
      contactNumber: this.basicInfoForm.controls.contactNumber.value,
      lineId: this.basicInfoForm.controls.lineId.value,
      availableTimes: this.availableTimes
    }
  }

}