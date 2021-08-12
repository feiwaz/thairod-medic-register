import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VerificationBody } from 'src/app/model/verification-body.model';
import { BaseResourceService } from './base-resource.service';
import { FileService } from './file.service';

export abstract class BaseRegistrationService extends BaseResourceService {

  constructor(
    protected resourcePrefix: string,
    protected http: HttpClient,
    protected fileService: FileService,
    protected sanitizer: DomSanitizer
  ) {
    super(resourcePrefix, http);
  }

  getRegisterInfo(nationalId: number): Observable<any> {
    const url = `${this.resourcePrefix}/${nationalId}/register-info`;
    return this.http.get<any>(url);
  }

  create(user: any, blobs?: Blob[]): Observable<any> {
    user.dateOfBirth = moment(user.dateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD');
    user.availableTimes = user.availableTimes.join();
    const formData: any = new FormData();
    formData.append('body', JSON.stringify(user));
    this.fileService.appendFilesToFormData(blobs, formData);
    return this.http.post<any>(`${this.resourcePrefix}`, formData);
  }

  findOne(id: number): Observable<any> {
    const url = `${this.resourcePrefix}/${id}`;
    return this.http.get<any>(url);
  }

  findOneFile(id: number, filePath: string): Observable<any> {
    let url = '';
    try {
      const filePaths = filePath.split('/');
      url = `${this.resourcePrefix}/${id}/folders/${filePaths[0]}/files/${filePaths[1]}`;
    } catch (error) {
      console.log(`Unable to resolve the file path: ${filePath}`);
    }
    return this.http.get<any>(url, { responseType: 'blob' as 'json' }).pipe(map(
      response => {
        let blobUrl = '' as any;
        if (response && ['image/jpeg', 'image/png'].includes(response.type)) {
          try {
            blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(response));
          } catch (error) {
            console.warn('Unable to create object URL');
          }
        }
        return blobUrl;
      }
    ));
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
