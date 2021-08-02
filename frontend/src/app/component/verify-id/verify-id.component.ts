import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from 'src/app/service/doctor.service';
import { VolunteerService } from 'src/app/service/volunteer.service';
import { maskId, partialMaskId } from 'src/app/util/util-functions';

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
  service: DoctorService | VolunteerService = this.volunteerService;

  verifyForm = this.fb.group({
    id: ['', [
      Validators.required,
      Validators.min(1000000000000),
      Validators.max(9999999999999)
    ]]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private volunteerService: VolunteerService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.role = data.role || this.role);
    this.service = this.role === 'doctor' ? this.doctorService : this.volunteerService;
    this.subscribeIdInputValueChanges();
  }

  subscribeIdInputValueChanges() {
    this.verifyForm.controls.id.valueChanges.subscribe(
      value => this.maskedId = partialMaskId(value)
    );
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
    this.service.findOne(this.verifyForm.controls.id.value).subscribe(
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
      this.router.navigate([`/${this.role}/review-tc`], {
        state: { id: this.verifyForm.controls.id.value }
      });
    }
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
    this.service.findOne(this.verifyForm.controls.id.value).subscribe(
      response => this.handleSuccessfulCheckUserStatus(response),
      errorResponse => this.handleErrorResponse()
    );
  }

  handleSuccessfulCheckUserStatus(response: any): void {
    if (Object.keys(response).length) {
      this.verifyForm.enable();
      this.isLoading = false;
      const maskedId = maskId(this.verifyForm.controls.id.value);
      this.router.navigate([`/update-status`], {
        state: { id: maskedId, status: response.status }
      });
    } else {
      this.handleErrorResponse();
    }
  }

  onClearInput() {
    this.verifyForm.controls.id.setValue('');
    this.isExistingUser = false;
  }

}
