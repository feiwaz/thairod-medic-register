import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter, MomentDateModule } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLoginComponent } from './component/admin-login/admin-login.component';
import { AvailableTimeFormComponent } from './component/available-time-form/available-time-form.component';
import { BasicInfoFormComponent } from './component/basic-info-form/basic-info-form.component';
import { DoctorJobInfoFormComponent } from './component/doctor-job-info-form/doctor-job-info-form.component';
import { DoctorComponent } from './component/doctor/doctor.component';
import { MainComponent } from './component/main/main.component';
import { ReviewInfoComponent } from './component/review-info/review-info.component';
import { ReviewTcComponent } from './component/review-tc/review-tc.component';
import { ToolbarComponent } from './component/toolbar/toolbar.component';
import { UpdateStatusComponent } from './component/update-status/update-status.component';
import { UploadPhotoComponent } from './component/upload-photo/upload-photo.component';
import { VerifyIdComponent } from './component/verify-id/verify-id.component';
import { VolunteerJobInfoFormComponent } from './component/volunteer-job-info-form/volunteer-job-info-form.component';
import { HttpResponseInterceptor } from './interceptor/http-response.interceptor';
import { SharedModule } from './module/shared.module';

export const DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMM YYYY'
  }
};

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    VerifyIdComponent,
    ReviewTcComponent,
    ToolbarComponent,
    DoctorComponent,
    UpdateStatusComponent,
    BasicInfoFormComponent,
    DoctorJobInfoFormComponent,
    ReviewInfoComponent,
    AdminLoginComponent,
    UploadPhotoComponent,
    AvailableTimeFormComponent,
    VolunteerJobInfoFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatRadioModule,
    MomentDateModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: (): string => localStorage.getItem('accessToken') || '',
        // allowedDomains: ['localhost:3000', 'localhost:4200']
      }
    })
  ],
  providers: [{
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  }, {
    provide: MAT_DATE_LOCALE, useValue: 'th-TH'
  }, {
    provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT
  }, {
    provide: HTTP_INTERCEPTORS, useClass: HttpResponseInterceptor, multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
