import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { VerificationBody } from 'src/app/model/verification-body.model';
import { BaseResourceService } from './base-resource.service';
import { FileService } from './file.service';

export abstract class BaseRegistrationService extends BaseResourceService {

  constructor(
    protected resourcePrefix: string,
    protected http: HttpClient,
    protected fileService: FileService
  ) {
    super(resourcePrefix, http);
  }

  findOne(nationalId: number): Observable<any> {
    const url = `${this.resourcePrefix}/${nationalId}`;
    return this.http.get<any>(url);
  }

  create(user: any, blobs?: Blob[]): Observable<any> {
    user.dateOfBirth = moment(user.dateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const formData: any = new FormData();
    formData.append('body', JSON.stringify(user));
    this.fileService.appendFilesToFormData(blobs, formData);
    return this.http.post<any>(`${this.resourcePrefix}`, formData);
  }

  getResources(): Observable<any[]> {
    return super.getResources();
  }

  updateStatus(id: number, body: VerificationBody): Observable<any> {
    const url = `${this.resourcePrefix}/${id}/verify-registration-status`;
    return this.http.patch<any>(url, body);
  }

  checkStatus(nationalId: number): Observable<any> {
    const url = `${this.resourcePrefix}/${nationalId}/check-verification-status`;
    return this.http.get<any>(url);
  }

}
