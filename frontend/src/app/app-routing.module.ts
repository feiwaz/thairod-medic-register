import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './component/admin-login/admin-login.component';
import { AvailableTimeFormComponent } from './component/available-time-form/available-time-form.component';
import { BasicInfoFormComponent } from './component/basic-info-form/basic-info-form.component';
import { DoctorJobInfoFormComponent } from './component/doctor-job-info-form/doctor-job-info-form.component';
import { MainComponent } from './component/main/main.component';
import { ReviewInfoComponent } from './component/review-info/review-info.component';
import { ReviewTcComponent } from './component/review-tc/review-tc.component';
import { UpdateStatusComponent } from './component/update-status/update-status.component';
import { VerifyIdComponent } from './component/verify-id/verify-id.component';
import { VolunteerJobInfoFormComponent } from './component/volunteer-job-info-form/volunteer-job-info-form.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  { path: 'main', component: MainComponent },
  {
    path: 'doctor',
    data: { role: 'doctor' },
    children: [{
      path: 'verify-id', component: VerifyIdComponent
    }, {
      path: 'review-tc', component: ReviewTcComponent
    }, {
      path: 'basic-info', component: BasicInfoFormComponent
    }, {
      path: 'job-info', component: DoctorJobInfoFormComponent
    }, {
      path: 'available-time', component: AvailableTimeFormComponent
    }, {
      path: 'review-info', component: ReviewInfoComponent
    }]
  },
  {
    path: 'volunteer',
    data: { role: 'volunteer' },
    children: [{
      path: 'verify-id', component: VerifyIdComponent
    }, {
      path: 'review-tc', component: ReviewTcComponent
    }, {
      path: 'basic-info', component: BasicInfoFormComponent
    }, {
      path: 'job-info', component: VolunteerJobInfoFormComponent
    }, {
      path: 'available-time', component: AvailableTimeFormComponent
    }, {
      path: 'review-info', component: ReviewInfoComponent
    }]
  },
  { path: 'verify-id', component: VerifyIdComponent },
  { path: 'update-status', component: UpdateStatusComponent },
  {
    path: 'admin/main', loadChildren: () =>
      import('./module/admin/admin.module').then(mod => mod.AdminModule),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'admin', component: AdminLoginComponent
  },
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: '**', redirectTo: 'main' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
