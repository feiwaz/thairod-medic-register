import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordFormComponent } from 'src/app/component/change-password-form/change-password-form.component';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserAccountDialogComponent } from './user-account-dialog.component';

describe('UserAccountDialogComponent', () => {
  let component: UserAccountDialogComponent;
  let fixture: ComponentFixture<UserAccountDialogComponent>;

  const authService = jasmine.createSpyObj('AuthenticationService', ['currentUser']);
  const toastrService = jasmine.createSpyObj('ToastrService', ['success', 'warning']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAccountDialogComponent, ChangePasswordFormComponent],
      imports: [
        HttpClientTestingModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        FormsModule,
        MatProgressBarModule,
        MatDialogModule,
        BrowserAnimationsModule
      ],
      providers: [{
        provide: MAT_DIALOG_DATA,
        useValue: {}
      }, {
        provide: AuthenticationService,
        useValue: authService
      }, {
        provide: ToastrService,
        useValue: toastrService
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
