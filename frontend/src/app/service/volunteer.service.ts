import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BasicInfo } from '../model/basic-info.model';
import { VerificationBody } from '../model/verification-body.model';
import { VolunteerJobInfo } from '../model/volunteer-job-info.model';
import { BaseRegistrationService } from './base-registration.service';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService extends BaseRegistrationService {

  constructor(
    http: HttpClient,
    fileService: FileService
  ) {
    super(`${environment.apiPrefix}/volunteers`, http, fileService);
  }

  getRegisterInfo(nationalId: number): Observable<any> {
    return super.getRegisterInfo(nationalId);
  }

  create(user: BasicInfo & VolunteerJobInfo, blobs?: Blob[]): Observable<any> {
    return super.create(user, blobs);
  }

  findOne(id: number): Observable<any> {
    return super.findOne(id);
  }

  findOneFile(id: number, filePath: string): Observable<any> {
    return super.findOneFile(id, filePath);
  }

  getVolunteers(): Observable<any[]> {
    return super.getResources();
  }

  updateStatus(id: number, body: VerificationBody): Observable<any> {
    return super.updateStatus(id, body);
  }

  getApprovedVolunteers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.resourcePrefix}/approved`);
  }

  updateTrainingStatus(id: string, volunteerDepartments: any[]): Observable<any> {
    const url = `${this.resourcePrefix}/${id}/training-status`;
    return this.http.put<any>(url, { volunteerDepartments: volunteerDepartments });
  }

  checkStatus(nationalId: number): Observable<any> {
    return super.checkStatus(nationalId);
  }

}
