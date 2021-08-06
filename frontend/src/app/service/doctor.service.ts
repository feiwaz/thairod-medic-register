import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasicInfo } from '../model/basic-info';
import { DoctorJobInfo } from '../model/doctor-job-info';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private http: HttpClient) { }

  findOne(nationalId: number): Observable<any> {
    const url = `${environment.apiPrefix}/doctors/${nationalId}`;
    return this.http.get<any>(url);
  }

  create(user: BasicInfo & DoctorJobInfo, blobs?: Blob[]): Observable<any> {
    user.dateOfBirth = moment(user.dateOfBirth, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const formData: any = new FormData();
    formData.append('body', JSON.stringify(user));
    if (blobs) {
      blobs.forEach((blob: Blob, index: number) => formData.append(`file${index}`, new File([blob], `file${index}`)));
    }
    const url = `${environment.apiPrefix}/doctors`;
    return this.http.post<any>(url, formData);
  }

  async getFilesByBlobUrl(): Promise<any> {
    const idCardString = localStorage.getItem('idCard') || '';
    const idCard = await this.getBlobPromise(idCardString);

    const idCardSelfieString = localStorage.getItem('idCardSelfie') || '';
    const idCardSelfie = await this.getBlobPromise(idCardSelfieString);

    const medCertificateString = localStorage.getItem('medCertificate') || '';
    const medCertificate = await this.getBlobPromise(medCertificateString);

    const medCertificateSelfieString = localStorage.getItem('medCertificateSelfie') || '';
    const medCertificateSelfie = await this.getBlobPromise(medCertificateSelfieString);

    return [idCard, idCardSelfie, medCertificate, medCertificateSelfie];
  }

  private getBlobPromise(jsonString: string) {
    return this.http.get(JSON.parse(jsonString).blobUrl, { responseType: 'blob' as 'json' }).toPromise();
  }

}
