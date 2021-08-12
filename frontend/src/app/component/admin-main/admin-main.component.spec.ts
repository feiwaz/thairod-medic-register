import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { SafeHtmlPipe } from 'src/app/pipe/safe-html.pipe';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { AccountMenuComponent } from '../account-menu/account-menu.component';
import { ManageRegisteredUserComponent } from '../manage-registered-user/manage-registered-user.component';
import { AdminMainComponent } from './admin-main.component';

describe('AdminMainComponent', () => {
  let component: AdminMainComponent;
  let fixture: ComponentFixture<AdminMainComponent>;
  let router: Router;

  const toastrService = jasmine.createSpyObj('ToastrService', ['success']);
  const authService = jasmine.createSpyObj('AuthenticationService', ['getRefreshToken']);
  const matDialog = jasmine.createSpyObj('MatDialog', ['closeAll']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminMainComponent,
        AccountMenuComponent,
        SafeHtmlPipe
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(
          [
            { path: 'admin/main/manage-account', component: AdminMainComponent },
            { path: 'admin/main/manage-registered-user', component: ManageRegisteredUserComponent }
          ]
        ),
        MatIconModule,
        MatListModule,
        MatMenuModule,
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
