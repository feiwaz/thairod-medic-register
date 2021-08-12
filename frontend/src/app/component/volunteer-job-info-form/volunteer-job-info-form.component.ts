import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DEPARTMENTS } from '../../constant/departments';
import { VolunteerJobInfo } from '../../model/volunteer-job-info.model';
import { FileService } from '../../service/file.service';
import { ImageCachingService } from '../../service/image-caching.service';
import { numbersOnly } from '../../util/util-functions';
@Component({
  selector: 'app-volunteer-job-info-form',
  templateUrl: './volunteer-job-info-form.component.html',
  styleUrls: ['./volunteer-job-info-form.component.scss'],
})
export class VolunteerJobInfoFormComponent implements OnInit {

  role = 'volunteer';
  isEditing = false;
  jobInfo: VolunteerJobInfo = {
    departments: [],
    idCard: null as any,
    idCardSelfie: null as any,
    medCertificateId: 0,
    medCertificate: null as any,
    medCertificateSelfie: null as any
  };

  departments = DEPARTMENTS;

  jobInfoForm = this.fb.group({
    department1: false,
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
    idCard: [null, Validators.required],
    idCardSelfie: [null, Validators.required],
    medCertificateId: ['', [Validators.min(10000), Validators.max(99999)]],
    medCertificate: [null],
    medCertificateSelfie: [null]
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
      const { departments, medCertificateId } = JSON.parse(jobInfoString) as VolunteerJobInfo;
      this.jobInfoForm.patchValue({ departments, medCertificateId });

      if (departments.length !== 0) {
        departments.forEach((viewValue: string) => {
          this.departments
            .filter(department => department.viewValue === viewValue)
            .map(department => this.jobInfoForm.controls[department.formControlName].setValue(true));
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

  buildJobInfo(): VolunteerJobInfo {
    const departments = this.buildDepartments();
    const medCertificateId = this.jobInfoForm.controls.medCertificateId.value;
    const idCard = this.jobInfoForm.controls.idCard.value;
    const idCardSelfie = this.jobInfoForm.controls.idCardSelfie.value;
    const medCertificate = this.jobInfoForm.controls.medCertificate.value;
    const medCertificateSelfie = this.jobInfoForm.controls.medCertificateSelfie.value;
    let jobInfo = { departments, idCard, idCardSelfie } as VolunteerJobInfo;
    if (medCertificateId) {
      jobInfo.medCertificateId = medCertificateId;
    }
    if (medCertificate) {
      jobInfo.medCertificate = medCertificate;
    }
    if (medCertificateSelfie) {
      jobInfo.medCertificateSelfie = medCertificateSelfie;
    }
    return jobInfo;
  }

  buildDepartments() {
    return this.departments.reduce((result, department) => {
      if (this.jobInfoForm.controls[department.formControlName].value === true) {
        result.push(department.viewValue);
      }
      return result;
    }, [] as any);
  }

  filterType(isOnline = true) {
    return this.departments.filter(department => department.isOnline === isOnline);
  }

  clearValue(id: string) {
    this.jobInfoForm.patchValue({ [id]: '' });
  }

  onImageChanged(imageObject: any, id: string): void {
    if (imageObject && imageObject.files && imageObject.files.length > 0) {
      const file = imageObject.files[0];
      this.jobInfoForm.patchValue({ [id]: { fileName: [file.name], blobUrl: imageObject.blobUrl } });
      this.imageCachingService.cacheBlobUrl(id, file.name, imageObject.blobUrl, file.type);
    } else {
      this.jobInfoForm.patchValue({ [id]: null });
      window.URL.revokeObjectURL(imageObject.blobUrl);
    }
  }

  inputNumber(event: any) {
    numbersOnly(event)
  }

}
