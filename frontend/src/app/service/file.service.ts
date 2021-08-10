import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  async getFilesByBlobUrl(): Promise<any> {
    const idCardString = localStorage.getItem('idCard') || '';
    const idCard = idCardString ? await this.getBlobPromise(idCardString) : null;

    const idCardSelfieString = localStorage.getItem('idCardSelfie') || '';
    const idCardSelfie = idCardSelfieString ? await this.getBlobPromise(idCardSelfieString) : null;

    const medCertificateString = localStorage.getItem('medCertificate') || '';
    const medCertificate = medCertificateString ? await this.getBlobPromise(medCertificateString) : null;

    const medCertificateSelfieString = localStorage.getItem('medCertificateSelfie') || '';
    const medCertificateSelfie = medCertificateSelfieString ? await this.getBlobPromise(medCertificateSelfieString) : null;

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

  appendFilesToFormData(blobs: Blob[] | undefined, formData: FormData) {
    if (blobs && blobs[0]) formData.append('idCard', this.createFile([blobs[0]], 'idCard'));
    if (blobs && blobs[1]) formData.append('idCardSelfie', this.createFile([blobs[1]], 'idCardSelfie'));
    if (blobs && blobs[2]) formData.append('medCertificate', this.createFile([blobs[2]], 'medCertificate'));
    if (blobs && blobs[3]) formData.append('medCertificateSelfie', this.createFile([blobs[3]], 'medCertificateSelfie'));
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
