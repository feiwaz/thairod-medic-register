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
import { UpdateTrainingStatusDialogComponent } from './update-training-status-dialog.component';

describe('UpdateTrainingStatusDialogComponent', () => {
  let component: UpdateTrainingStatusDialogComponent;
  let fixture: ComponentFixture<UpdateTrainingStatusDialogComponent>;

  const toastrService = jasmine.createSpyObj('ToastrService', ['warning']);
  const matDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateTrainingStatusDialogComponent],
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
        useValue: {
          row: { volunteerDepartments: [] }
        }
      }, {
        provide: ToastrService,
        useValue: toastrService
      }, {
        provide: MatDialogRef,
        useValue: matDialogRef
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTrainingStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
