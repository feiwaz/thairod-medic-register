import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicInfo } from '../../model/basic-info.model';
import { DoctorService } from '../../service/doctor.service';
import { FileService } from '../../service/file.service';
import { VolunteerService } from '../../service/volunteer.service';
import { maskId, numbersOnly, partialMaskId } from '../../util/util-functions';

interface roleOption {
  value: number;
  viewValue: string;
}

const roleOptions: roleOption[] = [
  { value: 0, viewValue: 'แพทย์' },
  { value: 1, viewValue: 'อาสาสมัคร' }
];

@Component({
  selector: 'app-verify-id',
  templateUrl: './verify-id.component.html',
  styleUrls: ['./verify-id.component.scss']
})
export class VerifyIdComponent implements OnInit {

  role = '';
  maskedId = '';
  isLoading = false;
  errorResponse = false;
  isExistingUser = false;
  roles: roleOption[] = roleOptions;
  service: DoctorService | VolunteerService = this.volunteerService;

  verifyForm = this.fb.group({
    nationalId: ['', [
      Validators.required,
      Validators.min(1000000000000),
      Validators.max(9999999999999)
    ]],
    role: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private volunteerService: VolunteerService,
    private fileService: FileService
  ) {
    this.route.data.subscribe(data => this.role = data.role || this.role);
  }

  ngOnInit(): void {
    this.fileService.clearSessionAndImageLocalStorage();
    this.service = this.role === 'doctor' ? this.doctorService : this.volunteerService;
    this.subscribeIdInputValueChanges();
    this.controlValidator();
  }

  subscribeIdInputValueChanges() {
    this.verifyForm.controls.nationalId.valueChanges.subscribe(
      value => this.maskedId = partialMaskId(value)
    );
  }

  controlValidator() {
    const roleControl = this.verifyForm.controls.role;
    if (this.role) {
      roleControl.clearValidators();
    } else {
      roleControl.setValidators(Validators.required);
    }
    roleControl.updateValueAndValidity();
  }

  onSubmit(): void {
    this.verifyForm.disable();
    this.isLoading = true;
    this.errorResponse = false;
    this.isExistingUser = false;
    if (this.role) {
      this.verifyUserId();
    } else {
      this.checkUserStatus();
    }
  }

  verifyUserId(): void {
    this.service.getRegisterInfo(this.verifyForm.controls.nationalId.value).subscribe(
      response => this.handleSuccessfulVerifyUserId(response),
      errorResponse => this.handleErrorResponse()
    );
  }

  handleSuccessfulVerifyUserId(response: any): void {
    this.verifyForm.enable();
    this.isLoading = false;
    if (Object.keys(response).length) {
      this.isExistingUser = true;
    } else {
      const basicInfo = this.buildBasicInfo();
      sessionStorage.setItem(`${this.role}BasicInfo`, JSON.stringify(basicInfo));
      this.router.navigate([`/${this.role}/review-tc`]);
    }
  }

  buildBasicInfo(): BasicInfo {
    return {
      nationalId: this.verifyForm.controls.nationalId.value, initial: '', gender: '', firstName: '',
      lastName: '', dateOfBirth: '', address: '', contactNumber: '', availableTimes: []
    };
  }

  onExistingUserCheckStatus(): void {
    this.verifyForm.disable();
    this.isLoading = true;
    this.checkUserStatus();
  }

  handleErrorResponse(): void {
    this.verifyForm.enable();
    this.isLoading = false;
    this.errorResponse = true;
  }

  checkUserStatus(): void {
    let service = this.service;
    if (!this.role) {
      service = this.verifyForm.controls.role.value === 0 ? this.doctorService : this.volunteerService;
    }
    service.checkStatus(this.verifyForm.controls.nationalId.value).subscribe(
      response => this.handleSuccessfulCheckUserStatus(response),
      errorResponse => this.handleErrorResponse()
    );
  }

  handleSuccessfulCheckUserStatus(response: any): void {
    if (Object.keys(response).length) {
      this.verifyForm.enable();
      this.isLoading = false;
      const maskedId = maskId(this.verifyForm.controls.nationalId.value);
      const data = {
        ...response, ...{
          maskedId,
          nationalId: this.verifyForm.controls.nationalId.value,
          role: this.verifyForm.controls.role.value
        }
      };
      this.router.navigate(['/update-status'], {
        state: { data }
      });
    } else {
      this.handleErrorResponse();
    }
  }

  onClearInput() {
    this.verifyForm.controls.nationalId.setValue('');
    this.isExistingUser = false;
  }

  inputNumber(event: any) {
    numbersOnly(event)
  }

}
