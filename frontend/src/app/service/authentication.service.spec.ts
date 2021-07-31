import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  const jwtHelper = jasmine.createSpyObj('JwtHelper', ['decodeToken']);
  const router = jasmine.createSpyObj('Router', ['navigate']);
  const matDialog = jasmine.createSpyObj('MatDialog', ['closeAll']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: JwtHelperService,
        useValue: jwtHelper
      }, {
        provide: Router,
        useValue: router
      }, {
        provide: MatDialog,
        useValue: matDialog
      }]
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
