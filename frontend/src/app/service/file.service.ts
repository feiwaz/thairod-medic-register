import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

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

  createFile(fileBits: BlobPart[], fileName: string): File {
    return new File(fileBits, fileName, this.getType(fileName));
  }

  getType(storageKey: string): { type: string } {
    let type = '';
    const jsonString = localStorage.getItem(storageKey);
    if (jsonString) {
      type = JSON.parse(jsonString).type;
    }
    return { type }
  }

  clearSessionAndImageLocalStorage(): void {
    sessionStorage.clear();
    this.clearImageLocalStorage();
  }

  clearImageLocalStorage(): void {
    localStorage.removeItem('idCard');
    localStorage.removeItem('idCardSelfie');
    localStorage.removeItem('medCertificate');
    localStorage.removeItem('medCertificateSelfie');
  }

}
