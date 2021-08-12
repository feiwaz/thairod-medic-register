import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';

export abstract class BaseResourceService {

  constructor(
    protected resourcePrefix: string,
    protected http: HttpClient
  ) { }

  getResources(): Observable<any[]> {
    return this.http.get<any[]>(`${this.resourcePrefix}`);
  }

}
