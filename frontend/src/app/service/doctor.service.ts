import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasicInfo } from '../model/basic-info.model';
import { DoctorJobInfo } from '../model/doctor-job-info.model';
import { VerificationBody } from '../model/verification-body.model';
import { BaseRegistrationService } from './base-registration.service';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorService extends BaseRegistrationService {

  constructor(
    http: HttpClient,
    fileService: FileService,
    sanitizer: DomSanitizer
  ) {
    super(`${environment.apiPrefix}/doctors`, http, fileService, sanitizer);
  }

  getRegisterInfo(nationalId: number): Observable<any> {
    return super.getRegisterInfo(nationalId);
  }

  create(user: BasicInfo & DoctorJobInfo, blobs?: Blob[]): Observable<any> {
    return super.create(user, blobs);
  }

  findOne(id: number): Observable<any> {
    return super.findOne(id);
  }

  findOneFile(id: number, filePath: string): Observable<any> {
    return super.findOneFile(id, filePath);
  }

  getDoctors(): Observable<any[]> {
    return super.getResources();
  }

  updateStatus(id: number, body: VerificationBody): Observable<any> {
    return super.updateStatus(id, body);
  }

  checkStatus(nationalId: number): Observable<any> {
    return super.checkStatus(nationalId);
  }

}
