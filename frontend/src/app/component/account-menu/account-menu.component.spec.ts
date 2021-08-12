import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../service/authentication.service';
import { AccountMenuComponent } from './account-menu.component';

describe('AccountMenuComponent', () => {
  let component: AccountMenuComponent;
  let fixture: ComponentFixture<AccountMenuComponent>;

  const toastrService = jasmine.createSpyObj('ToastrService', ['success']);
  const router = { navigate: jasmine.createSpy('navigate') };
  const authService = jasmine.createSpyObj('AuthenticationService', ['logout']);
  const matDialog = jasmine.createSpyObj('MatDialog', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountMenuComponent],
      imports: [
        HttpClientTestingModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule
      ],
      providers: [{
        provide: ToastrService,
        useValue: toastrService
      }, {
        provide: Router,
        useValue: router
      }, {
        provide: AuthenticationService,
        useValue: authService
      }, {
        provide: MatDialog,
        useValue: matDialog
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
