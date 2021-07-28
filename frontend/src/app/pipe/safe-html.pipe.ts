import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanitized: DomSanitizer) { }

  transform(htmlString: string) {
    return this.sanitized.bypassSecurityTrustHtml(htmlString);
  }

}
