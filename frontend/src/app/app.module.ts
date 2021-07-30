import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BasicInfoFormComponent } from './component/basic-info-form/basic-info-form.component';
import { DoctorComponent } from './component/doctor/doctor.component';
import { MainComponent } from './component/main/main.component';
import { ReviewTcComponent } from './component/review-tc/review-tc.component';
import { ToolbarComponent } from './component/toolbar/toolbar.component';
import { UpdateStatusComponent } from './component/update-status/update-status.component';
import { VerifyIdComponent } from './component/verify-id/verify-id.component';
import { SafeHtmlPipe } from './pipe/safe-html.pipe';
import { DoctorJobInfoFormComponent } from './component/doctor-job-info-form/doctor-job-info-form.component';
import { ReviewInfoComponent } from './component/review-info/review-info.component';

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
    SafeHtmlPipe,
    DoctorJobInfoFormComponent,
    ReviewInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatToolbarModule,
    MomentDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
