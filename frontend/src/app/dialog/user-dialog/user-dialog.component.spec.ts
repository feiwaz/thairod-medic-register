import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoleService } from '@services/role.service';
import { UserService } from '@services/user.service';
import { asyncData } from '@utils/async-observable-helpers';
import { ToastrService } from 'ngx-toastr';
import { UserDialogComponent } from './user-dialog.component';

describe('UserDialogComponent', () => {
  let component: UserDialogComponent;
  let fixture: ComponentFixture<UserDialogComponent>;

  const roleService = jasmine.createSpyObj('RoleService', ['getRoles']);
  const userService = jasmine.createSpyObj('UserService', ['createUser', 'updateUser']);
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
        provide: RoleService,
        useValue: roleService
      }, {
        provide: UserService,
        useValue: userService
      }, {
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

    roleService.getRoles.and.returnValue(asyncData([
      { _id: '60391b846a4cc87510ee69dc', value: 0, text: 'Pokémon Trainer', __v: 0 },
      { _id: '60391b976a4cc87510ee69de', value: 1, text: 'Pokémon Master', __v: 0 },
      { _id: '60391ba16a4cc87510ee69df', value: 2, text: 'Gym Leader', __v: 0 },
      { _id: '60391baa6a4cc87510ee69e0', value: 3, text: 'Elite Four', __v: 0 },
      { _id: '60391bb36a4cc87510ee69e1', value: 4, text: 'Pokémon Champion', __v: 0 },
      { _id: '60391c956a4cc87510ee69e2', value: 9, text: 'Admin', __v: 0 }
    ]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
