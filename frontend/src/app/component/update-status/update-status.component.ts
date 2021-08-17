import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasicInfo } from '../../model/basic-info.model';
import { DoctorService } from '../../service/doctor.service';
import { ImageCachingService } from '../../service/image-caching.service';
import { VolunteerService } from '../../service/volunteer.service';

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss']
})
export class UpdateStatusComponent implements OnInit {

  mainLogo = '';
  verifyStatusLogo = '';
  maskedId = '';
  nationalId = 0;
  status = '';
  statusNote = '';
  role = 0;
  isLoading = false;
  service: DoctorService | VolunteerService = this.volunteerService;

  constructor(
    private imgCachingService: ImageCachingService,
    private router: Router,
    private doctorService: DoctorService,
    private volunteerService: VolunteerService,
    private toastrService: ToastrService
  ) {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation && currentNavigation.extras.state) {
      const { maskedId, nationalId, role, status, statusNote } = currentNavigation.extras.state.data;
      this.maskedId = maskedId || this.maskedId;
      this.nationalId = nationalId || this.nationalId;
      this.role = role || this.role;
      this.status = status || this.status;
      this.statusNote = statusNote || this.statusNote;
      this.service = this.role === 0 ? this.doctorService : this.volunteerService;
    }
  }

  ngOnInit(): void {
    this.mainLogo = this.imgCachingService.getImgElement('thairod-logo');
    this.verifyStatusLogo = this.imgCachingService.getImgElement('verify-status', { width: '320px', height: '320px' });
  }

  onBackToMain(): void {
    this.router.navigate(['main']);
  }

  reRegister(): void {
    this.service.getRegisterInfo(this.nationalId).subscribe(
      response => this.handleSuccessfulVerifyUserId(response),
      errorResponse => this.handleErrorResponse()
    );
  }

  handleSuccessfulVerifyUserId(response: any): void {
    this.isLoading = false;
    if (Object.keys(response).length) {
      this.toastrService.warning('ตรวจสอบเลขประจำตัวประชาชนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    } else {
      const basicInfo = this.buildBasicInfo();
      const roleText = this.role === 0 ? 'doctor' : 'volunteer';
      sessionStorage.setItem(`${roleText}BasicInfo`, JSON.stringify(basicInfo));
      this.router.navigate([`/${roleText}/review-tc`]);
    }
  }

  buildBasicInfo(): BasicInfo {
    return {
      nationalId: this.nationalId, initial: '', firstName: '', lastName: '',
      dateOfBirth: '', address: '', contactNumber: '', lineId: '', availableTimes: []
    }
  }

  handleErrorResponse(): void {
    this.isLoading = false;
    this.toastrService.warning('ตรวจสอบเลขประจำตัวประชาชนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
  }

}
