import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ImageObject } from '../../model/image-object.model';
import { FileService } from '../../service/file.service';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.scss']
})
export class UploadPhotoComponent implements OnInit {

  @Input() id = '';
  @Input() matIcon = '';
  @Input() header = '';
  @Input() subHeader = '';
  @Input() required = false;

  @Output() image = new EventEmitter<ImageObject>();

  @ViewChild('thumbnail')
  thumbnail!: ElementRef;

  files = FileList as any;
  fileName = '';
  thumb: string | SafeUrl = '';

  constructor(
    private sanitizer: DomSanitizer,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    const blobUrlFromCache = localStorage.getItem(this.id);
    if (blobUrlFromCache) {
      const cachedImage = JSON.parse(blobUrlFromCache);
      this.fileName = cachedImage.fileName;
      this.thumb = this.sanitizer.bypassSecurityTrustUrl(cachedImage.blobUrl);
    }
  }

  async onInputFileChanged(fileInput: any) {
    const rawFiles = fileInput.files;
    if (rawFiles.length > 0) {
      const config = { file: rawFiles[0], maxSize: 500 };
      const resizedImage = await this.fileService.resizeImage(config);
      this.files = [new File([resizedImage], rawFiles[0].name, { type: resizedImage.type })];
      const aFile = this.files[0];
      this.fileName = aFile.name;
      this.thumb = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(aFile));
    }
  }

  onThumbnailLoaded(imgElement: HTMLImageElement): void {
    this.image.emit({ files: this.files, blobUrl: imgElement.src });
  }

  onImageError(): void {
    this.files = null;
    this.fileName = '';
    this.thumb = '';
  }

  onDeleteClick(): void {
    const thumbnail = this.thumbnail.nativeElement;
    this.image.emit({ files: null as any, blobUrl: thumbnail.src });
    this.files = null;
    this.fileName = '';
    this.thumb = '';
  }

}
