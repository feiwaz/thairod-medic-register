import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { VerificationBody } from '../model/verification-body.model';
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

  getRegisterInfo(nationalId: number): Observable<any> {
    const url = `${this.resourcePrefix}/${nationalId}/register-info`;
    return this.http.get<any>(url);
  }

  create(user: any, blobs?: Blob[]): Observable<any> {
    user.availableTimes = user.availableTimes.join();
    const formData: any = new FormData();
    formData.append('body', JSON.stringify(user));
    this.fileService.appendFilesToFormData(blobs, formData);
    return this.http.post<any>(`${this.resourcePrefix}`, formData, {
      observe: 'events', reportProgress: true
    });
  }

  findOne(id: number): Observable<any> {
    const url = `${this.resourcePrefix}/${id}`;
    return this.http.get<any>(url);
  }

  findOneFile(resourcePath: string): Observable<any> {
    try {
      let regex = new RegExp(/^(doctors|volunteers)\/[0-9]{13,13}\/files\/[0-9a-zA-Z]{32,32}$/);
      if (!regex.test(resourcePath)) throw new Error();
    } catch (error) {
      return of(null);
    }

    const url = `${environment.apiPrefix}/${resourcePath}`;
    const options = { responseType: 'blob' as 'json' };
    return this.http.get<any>(url, options).pipe(
      map(response => {
        let blobUrl = '' as any;
        if (response && ['image/jpeg', 'image/png'].includes(response.type)) {
          try {
            blobUrl = URL.createObjectURL(response);
          } catch (error) {
            console.warn('Unable to create object URL');
          }
        }
        return blobUrl;
      })
    );
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
