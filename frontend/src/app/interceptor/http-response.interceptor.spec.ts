import { TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../service/authentication.service';
import { HttpResponseInterceptor } from './http-response.interceptor';

describe('HttpResponseInterceptor', () => {

  let interceptor: HttpResponseInterceptor;

  const toastrService = jasmine.createSpyObj('ToastrService', ['error']);
  const authService = jasmine.createSpyObj('AuthenticationService', ['refreshToken', 'logout']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // imports: [HttpClientTestingModule],
      providers: [{
        provide: ToastrService,
        useValue: toastrService
      }, {
        provide: AuthenticationService,
        useValue: authService
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    interceptor = new HttpResponseInterceptor(
      TestBed.inject(ToastrService),
      TestBed.inject(AuthenticationService)
    );
  });

  it('should create', () => {
    expect(interceptor).toBeTruthy();
  });

});
