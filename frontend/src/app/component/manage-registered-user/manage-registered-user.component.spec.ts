import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';
import { WorkspaceService } from 'src/app/service/workspace.service';
import { ColumnFilterComponent } from '../column-filter/column-filter.component';
import { RegisteredUserListComponent } from '../registered-user-list/registered-user-list.component';
import { ManageRegisteredUserComponent } from './manage-registered-user.component';

describe('ManageRegisteredUserComponent', () => {
  let component: ManageRegisteredUserComponent;
  let fixture: ComponentFixture<ManageRegisteredUserComponent>;

  const workspaceService = jasmine.createSpyObj('workspaceService', ['getWorkspace', 'save']);
  const toastrService = jasmine.createSpyObj('ToastrService', ['success']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ManageRegisteredUserComponent,
        RegisteredUserListComponent,
        ColumnFilterComponent
      ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatTabsModule,
        FormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatSelectModule,
        MatTableModule,
        BrowserAnimationsModule
      ],
      providers: [{
        provide: WorkspaceService,
        useValue: workspaceService
      }, {
        provide: ToastrService,
        useValue: toastrService
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRegisteredUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
