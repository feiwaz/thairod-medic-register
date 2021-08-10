import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasicInfo } from '../model/basic-info';
import { VolunteerJobInfo } from '../model/volunteer-job-info';
import { BaseRegistrationService } from './base-registration.service';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService extends BaseRegistrationService {

  constructor(http: HttpClient, fileService: FileService) {
    super(`${environment.apiPrefix}/volunteers`, http, fileService);
  }

  findOne(nationalId: number): Observable<any> {
    return super.findOne(nationalId);
  }

  create(user: BasicInfo & VolunteerJobInfo, blobs?: Blob[]): Observable<any> {
    return super.create(user, blobs);
  }

  getVolunteers(): Observable<any[]> {
    return super.getResources();
  }

  updateStatus(id: number, status: string): Observable<any> {
    return super.updateStatus(id, status);
  }

  getApprovedVolunteers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.resourcePrefix}/approved`);
  }

  updateTrainingStatus(id: string, volunteerDepartments: any[]): Observable<any> {
    const url = `${this.resourcePrefix}/${id}/training-status`;
    return this.http.put<any>(url, { volunteerDepartments: volunteerDepartments });
  }

}
