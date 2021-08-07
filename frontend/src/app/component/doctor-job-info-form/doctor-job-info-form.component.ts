import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SPECIALIZED_FIELDS } from 'src/app/constant/specialized-fields';
import { DoctorJobInfo } from 'src/app/model/doctor-job-info';
import { FileService } from 'src/app/service/file.service';
import { ImageCachingService } from 'src/app/service/image-caching.service';

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
    medCertificateId: 0,
    idCard: null as any,
    idCardSelfie: null as any,
    medCertificate: null as any,
    medCertificateSelfie: null as any
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
    idCard: [null, Validators.required],
    idCardSelfie: [null, Validators.required],
    medCertificate: [null, Validators.required],
    medCertificateSelfie: [null, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private imageCachingService: ImageCachingService,
    private fileService: FileService
  ) {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation) {
      this.isEditing = currentNavigation.extras.state?.isEditing || false;
    }
  }

  ngOnInit(): void {
    this.fileService.clearImageLocalStorage();
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
      medCertificateId: this.jobInfoForm.controls.medCertificateId.value,
      idCard: this.jobInfoForm.controls.idCard.value,
      idCardSelfie: this.jobInfoForm.controls.idCardSelfie.value,
      medCertificate: this.jobInfoForm.controls.medCertificate.value,
      medCertificateSelfie: this.jobInfoForm.controls.medCertificateSelfie.value
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

  onImageChanged(imageObject: any, id: string): void {
    if (imageObject.files.length > 0) {
      const file = imageObject.files[0];
      this.jobInfoForm.patchValue({ [id]: { fileName: [file.name], blobUrl: imageObject.blobUrl } });
      this.imageCachingService.cacheBlobUrl(id, file.name, imageObject.blobUrl, file.type);
    }
  }

}
