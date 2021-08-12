import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { SafeHtmlPipe } from 'src/app/pipe/safe-html.pipe';
import { AdminLoginComponent } from './admin-login.component';

describe('AdminLoginComponent', () => {
  let component: AdminLoginComponent;
  let fixture: ComponentFixture<AdminLoginComponent>;

  const jwtHelper = jasmine.createSpyObj('JwtHelper', ['decodeToken']);
  const matDialog = jasmine.createSpyObj('MatDialog', ['closeAll']);
  const toastrService = jasmine.createSpyObj('ToastrService', ['success', 'warning']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminLoginComponent,
        SafeHtmlPipe
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        BrowserAnimationsModule
      ],
      providers: [{
        provide: JwtHelperService,
        useValue: jwtHelper
      }, {
        provide: MatDialog,
        useValue: matDialog
      }, {
        provide: ToastrService,
        useValue: toastrService
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
