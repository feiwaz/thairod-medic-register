import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasicInfo } from '../model/basic-info';
import { VolunteerJobInfo } from '../model/volunteer-job-info';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {

  constructor(
    private http: HttpClient,
    private fileService: FileService
  ) { }

  findOne(nationalId: number): Observable<any> {
    const url = `${environment.apiPrefix}/volunteers/${nationalId}`;
    return this.http.get<any>(url);
  }

  create(user: BasicInfo & VolunteerJobInfo, blobs?: Blob[]): Observable<any> {
    user.dateOfBirth = moment(user.dateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const formData: any = new FormData();
    formData.append('body', JSON.stringify(user));

    if (blobs && blobs[0]) formData.append('idCard', this.fileService.createFile([blobs[0]], 'idCard'));
    if (blobs && blobs[1]) formData.append('idCardSelfie', this.fileService.createFile([blobs[1]], 'idCardSelfie'));
    if (blobs && blobs[2]) formData.append('medCertificate', this.fileService.createFile([blobs[2]], 'medCertificate'));
    if (blobs && blobs[3]) formData.append('medCertificateSelfie', this.fileService.createFile([blobs[3]], 'medCertificateSelfie'));

    const url = `${environment.apiPrefix}/volunteers`;
    return this.http.post<any>(url, formData);
  }

  getVolunteers(): Observable<BasicInfo[]> {
    return this.http.get<BasicInfo[]>(`${environment.apiPrefix}/volunteers`);
  }

  updateStatus(id: number, status: string): Observable<any> {
    console.log('updateStatus',id,'status',{status})
    return this.http.patch<any>(`${environment.apiPrefix}/volunteers/${id}/verify-registration-status`, {status});
  }
}
