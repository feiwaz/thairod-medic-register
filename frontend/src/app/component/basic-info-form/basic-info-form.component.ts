import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { BasicInfo } from 'src/app/model/basic-info';
import { partialMaskId } from 'src/app/util/util-functions';

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

function getLocale() {
  const locale = 'th';
  return `${locale}-u-ca-gregory`;
}

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

  basicInfoForm = this.fb.group({
    nationalId: ['', Validators.required],
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
  ) {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation) {
      this.isEditing = currentNavigation.extras.state?.isEditing || false;
    }
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.role = data.role || this.role);
    this.initials = this.role === 'doctor' ? doctorInitials : volunteerInitials;
    this.patchValue();
  }

  private patchValue() {
    let basicInfoString = sessionStorage.getItem(`${this.role}BasicInfo`);
    if (basicInfoString) {
      const { nationalId, initial, firstName, lastName, dateOfBirth, address,
        contactNumber, lineId, availableTimes } = JSON.parse(basicInfoString) as BasicInfo;
      this.nationalId = nationalId + '' || this.nationalId;
      this.availableTimes = availableTimes;
      this.basicInfoForm.patchValue({
        nationalId: partialMaskId(nationalId),
        initial: this.initials.find(option => option.viewValue === initial)?.value,
        firstName, lastName, dateOfBirth: moment(dateOfBirth, 'DD/MM/YYYY'),
        address, contactNumber, lineId
      });
    }
  }

  onBackToVerifyId(): void {
    this.router.navigate([`/${this.role}/verify-id`]);
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
      firstName: this.basicInfoForm.controls.firstName.value,
      lastName: this.basicInfoForm.controls.lastName.value,
      dateOfBirth: this.basicInfoForm.controls.dateOfBirth.value.format('DD/MM/YYYY'),
      address: this.basicInfoForm.controls.address.value,
      contactNumber: this.basicInfoForm.controls.contactNumber.value,
      lineId: this.basicInfoForm.controls.lineId.value,
      availableTimes: this.availableTimes
    }
  }

}