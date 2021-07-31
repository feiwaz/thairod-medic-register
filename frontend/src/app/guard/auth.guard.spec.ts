import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  const router = { navigate: jasmine.createSpy('navigate') };
  const authService = jasmine.createSpyObj('AuthenticationService', ['decodeAccessToken', 'isAdmin']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: Router,
        useValue: router
      }, {
        provide: AuthenticationService,
        useValue: authService
      }]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
