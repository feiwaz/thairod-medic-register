import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SPECIALIZED_FIELDS } from 'src/app/constant/specialized-fields';
import { DoctorJobInfo } from 'src/app/model/doctor-job-info';
import { ImageCachingService } from 'src/app/service/image-caching.service';

interface specializedFieldCheckbox {
  formControlName: string;
  viewValue: string;
}

@Component({
  selector: 'app-doctor-job-info-form',
  templateUrl: './doctor-job-info-form.component.html',
  styleUrls: ['./doctor-job-info-form.component.scss']
})
export class DoctorJobInfoFormComponent implements OnInit {

  role = '';

  jobInfo: DoctorJobInfo = {
    specializedFields: [],
    medCertificateId: 0,
    medCertificate: null as any,
    medCertificateSelfie: null as any,
    idCard: null as any,
    idCardSelfie: null as any
  };

  specializedFields: specializedFieldCheckbox[] = SPECIALIZED_FIELDS;

  jobInfoForm = this.fb.group({
    field1: [{ value: true, disabled: true }], field2: false,
    field3: false, field4: false, field5: false, field6: false,
    medCertificateId: ['', [
      Validators.required,
      Validators.min(10000),
      Validators.max(99999)
    ]],
    idCard: [null, Validators.required],
    idCardSelfie: [null],
    medCertificate: [null],
    medCertificateSelfie: [null]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private imageCachingService: ImageCachingService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.role = data.role || this.role);
    this.patchValue();
  }

  private patchValue() {
    let jobInfoString = sessionStorage.getItem('jobInfo');
    if (jobInfoString) {
      const { specializedFields, medCertificateId, idCard, idCardSelfie, medCertificate, medCertificateSelfie } = JSON.parse(jobInfoString);
      this.jobInfoForm.patchValue({ specializedFields, medCertificateId, idCard, idCardSelfie, medCertificate, medCertificateSelfie });
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
    sessionStorage.setItem('jobInfo', JSON.stringify(jobInfo));
    this.router.navigate([`/${this.role}/review-info`]);
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
      this.jobInfoForm.patchValue({ [id]: { fileName: [imageObject.files[0].name], blobUrl: imageObject.blobUrl } });
      this.imageCachingService.cacheBlobUrl(id, imageObject.files[0].name, imageObject.blobUrl);
    }
  }

}
