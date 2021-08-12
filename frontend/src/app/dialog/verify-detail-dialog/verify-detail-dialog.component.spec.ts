import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';
import { ToolbarComponent } from '../../component/toolbar/toolbar.component';
import { AuthenticationService } from '../../service/authentication.service';
import { VerifyDetailDialogComponent } from './verify-detail-dialog.component';


describe('VerifyDetailDialogComponent', () => {
  let component: VerifyDetailDialogComponent;
  let fixture: ComponentFixture<VerifyDetailDialogComponent>;

  const matDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
  const toastrService = jasmine.createSpyObj('ToastrService', ['warning']);
  const authService = jasmine.createSpyObj('AuthenticationService', ['currentUser']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyDetailDialogComponent, ToolbarComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatDialogModule,
        BrowserAnimationsModule
      ],
      providers: [{
        provide: MAT_DIALOG_DATA,
        useValue: {}
      }, {
        provide: MatDialogRef,
        useValue: matDialogRef
      }, {
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
    fixture = TestBed.createComponent(VerifyDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
