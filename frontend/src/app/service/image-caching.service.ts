import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageCachingService {

  constructor() { }

  getImgElement(fileName: string, size?: { width: string, height: string }): string {
    const imgElement = document.createElement('img');
    imgElement.id = fileName;
    if (fileName === 'thairod-logo') {
      imgElement.style.width = size?.width || '143px';
      imgElement.style.height = size?.height || '123px';
    } else {
      imgElement.style.width = size?.width || '120px';
      imgElement.style.height = size?.height || '120px';
    }

    const cachedSource = localStorage.getItem(imgElement.id);
    imgElement.src = cachedSource || `assets/img/${fileName}.png`;
    if (cachedSource == null) {
      imgElement.onload = () => this.cacheImgElement(imgElement);
    }

    return imgElement.outerHTML;
  }

  cacheImgElement(imgElement: HTMLImageElement) {
    localStorage.setItem(imgElement.id, this.converToDataURL(imgElement));
  }

  cacheBlobUrl(id: string, fileName: string, blobUrl: string, type: string) {
    const fileObject = { fileName, blobUrl, type };
    localStorage.setItem(id, JSON.stringify(fileObject));
  }

  converToDataURL(imgElement: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    context?.drawImage(imgElement, 0, 0);
    return canvas.toDataURL();
  }
}
