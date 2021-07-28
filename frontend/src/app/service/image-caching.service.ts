import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageCachingService {

  constructor() { }

  getLogoImgElement(): string {
    const imgElement = document.createElement('img');
    imgElement.id = 'thairod-logo';
    imgElement.style.width = '143px';
    imgElement.style.height = '123px';

    const cachedSource = localStorage.getItem(imgElement.id);
    imgElement.src = cachedSource || 'assets/img/Logo_ThaiRod_v1_Tran.png';
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
