import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface IResizeImageOptions {
  maxSize: number;
  file: File;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  async getFilesByBlobUrl(): Promise<any> {
    const idCardString = localStorage.getItem('idCard');
    const idCard = idCardString ? await this.getBlobPromise(idCardString) : null;

    const idCardSelfieString = localStorage.getItem('idCardSelfie');
    const idCardSelfie = idCardSelfieString ? await this.getBlobPromise(idCardSelfieString) : null;

    const medCertificateString = localStorage.getItem('medCertificate');
    const medCertificate = medCertificateString ? await this.getBlobPromise(medCertificateString) : null;

    const medCertificateSelfieString = localStorage.getItem('medCertificateSelfie');
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

  // Courtesy of https://stackoverflow.com/questions/23945494/use-html5-to-resize-an-image-before-upload
  resizeImage(settings: IResizeImageOptions): Promise<Blob> {
    const file = settings.file;
    const reader = new FileReader();
    const image = new Image();

    return new Promise((ok, no) => {
      if (!file.type.match(/image.*/)) {
        no(new Error("Not an image"));
        return;
      }

      reader.onload = (readerEvent: any) => {
        image.onload = () => ok(this.resize(image, settings));
        image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  private resize(image: HTMLImageElement, settings: IResizeImageOptions): Blob {
    let width = image.width;
    let height = image.height;

    if (width > height) {
      if (width > settings.maxSize) {
        height *= settings.maxSize / width;
        width = settings.maxSize;
      }
    } else {
      if (height > settings.maxSize) {
        width *= settings.maxSize / height;
        height = settings.maxSize;
      }
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    context?.drawImage(image, 0, 0, width, height);
    let dataUrl = canvas.toDataURL(settings.file.type);
    return this.dataURItoBlob(dataUrl);
  };

  private dataURItoBlob(dataURI: string): Blob {
    const bytes = dataURI.split(',')[0].indexOf('base64') >= 0
      ? atob(dataURI.split(',')[1])
      : unescape(dataURI.split(',')[1]);
    const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const max = bytes.length;
    const ia = new Uint8Array(max);
    for (var i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
    return new Blob([ia], { type: mime });
  };

}
