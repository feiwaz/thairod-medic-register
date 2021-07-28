import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageCachingService {

  constructor() { }

  getImgElement(fileName: string, size = { width: '120px', height: '120px' }): string {
    const imgElement = document.createElement('img');
    imgElement.id = fileName;
    if (fileName === 'thairod-logo') {
      imgElement.style.width = '143px';
      imgElement.style.height = '123px';
    } else {
      imgElement.style.width = size.width;
      imgElement.style.height = size.height;
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

  converToDataURL(imgElement: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    context?.drawImage(imgElement, 0, 0);
    return canvas.toDataURL();
  }
}
