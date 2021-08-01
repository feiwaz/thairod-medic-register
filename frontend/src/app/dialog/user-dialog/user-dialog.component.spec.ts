import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';
import { UserDialogComponent } from './user-dialog.component';

describe('UserDialogComponent', () => {
  let component: UserDialogComponent;
  let fixture: ComponentFixture<UserDialogComponent>;

  const toastrService = jasmine.createSpyObj('ToastrService', ['warning']);
  const matDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDialogComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [{
        provide: ToastrService,
        useValue: toastrService
      }, {
        provide: MatDialogRef,
        useValue: matDialogRef
      }, {
        provide: MAT_DIALOG_DATA,
        useValue: {}
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
