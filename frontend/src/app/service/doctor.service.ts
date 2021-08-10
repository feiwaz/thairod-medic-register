import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasicInfo } from '../model/basic-info';
import { DoctorJobInfo } from '../model/doctor-job-info';
import { BaseRegistrationService } from './base-registration.service';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorService extends BaseRegistrationService {

  constructor(http: HttpClient, fileService: FileService) {
    super(`${environment.apiPrefix}/doctors`, http, fileService);
  }

  findOne(nationalId: number): Observable<any> {
    return super.findOne(nationalId);
  }

  create(user: BasicInfo & DoctorJobInfo, blobs?: Blob[]): Observable<any> {
    return super.create(user, blobs);
  }

  getDoctors(): Observable<any[]> {
    return super.getResources();
  }

  updateStatus(id: number, status: string): Observable<any> {
    return super.updateStatus(id, status);
  }

}
