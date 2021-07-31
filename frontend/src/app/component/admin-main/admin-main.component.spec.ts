import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { AccountMenuComponent } from '../account-menu/account-menu.component';
import { AdminMainComponent } from './admin-main.component';

describe('AdminMainComponent', () => {
  let component: AdminMainComponent;
  let fixture: ComponentFixture<AdminMainComponent>;

  const toastrService = jasmine.createSpyObj('ToastrService', ['success']);
  const authService = jasmine.createSpyObj('AuthenticationService', ['logout']);
  const matDialog = jasmine.createSpyObj('MatDialog', ['closeAll']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminMainComponent, AccountMenuComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        BrowserAnimationsModule
      ],
      providers: [{
        provide: ToastrService,
        useValue: toastrService
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
    fixture = TestBed.createComponent(AdminMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
