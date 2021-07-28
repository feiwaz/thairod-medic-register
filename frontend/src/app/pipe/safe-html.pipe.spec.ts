import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtmlPipe } from './safe-html.pipe';

describe('SafeHtmlPipe', () => {

  const domSanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustHtml']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{
        provide: DomSanitizer,
        useValue: domSanitizer
      }]
    });
  });

  it('create an instance', () => {
    const pipe = new SafeHtmlPipe(domSanitizer);
    expect(pipe).toBeTruthy();
  });

  it('#transform should execute #sanitized.bypassSecurityTrustHtml', () => {
    const domSanitizerSpy = domSanitizer.bypassSecurityTrustHtml.and.callThrough();
    const pipe = new SafeHtmlPipe(domSanitizer);
    const htmlString = '<div>test</div>';
    pipe.transform(htmlString);
    expect(domSanitizerSpy).toHaveBeenCalledWith(htmlString);
  });

});
