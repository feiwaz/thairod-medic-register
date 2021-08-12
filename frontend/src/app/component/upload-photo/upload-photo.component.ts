import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ImageObject } from '../../model/image-object.model';

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

  @ViewChild('file')
  file!: ElementRef;

  @ViewChild('thumbnail')
  thumbnail!: ElementRef;

  files = FileList as any;
  fileName = '';
  thumb: string | SafeUrl = '';

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const blobUrlFromCache = localStorage.getItem(this.id);
    if (blobUrlFromCache) {
      const cachedImage = JSON.parse(blobUrlFromCache);
      this.fileName = cachedImage.fileName;
      this.thumb = this.sanitizer.bypassSecurityTrustUrl(cachedImage.blobUrl);
    }
  }

  onUploadClick(): void {
    const input = this.file.nativeElement;
    input.click();
  }

  onInputFileChanged(event: any): void {
    if (event.target.files.length > 0) {
      this.files = event.target.files;
      this.fileName = event.target.files[0].name;
      this.thumb = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(event.target.files[0])
      );
    }
  }

  onThumbnailLoaded(event: any): void {
    const thumbnail = this.thumbnail.nativeElement;
    this.image.emit({ files: this.files, blobUrl: thumbnail.src });
  }

  onImageError(event: any): void {
    this.files = null;
    this.fileName = '';
    this.thumb = '';
  }

  onDeleteClick(event: any): void {
    const thumbnail = this.thumbnail.nativeElement;
    this.image.emit({ files: null as any, blobUrl: thumbnail.src });
    this.files = null;
    this.fileName = '';
    this.thumb = '';
  }

}
