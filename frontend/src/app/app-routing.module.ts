import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicInfoFormComponent } from './component/basic-info-form/basic-info-form.component';
import { DoctorJobInfoFormComponent } from './component/doctor-job-info-form/doctor-job-info-form.component';
import { MainComponent } from './component/main/main.component';
import { ReviewInfoComponent } from './component/review-info/review-info.component';
import { ReviewTcComponent } from './component/review-tc/review-tc.component';
import { UpdateStatusComponent } from './component/update-status/update-status.component';
import { VerifyIdComponent } from './component/verify-id/verify-id.component';

const routes: Routes = [
  { path: 'main', component: MainComponent },
  {
    path: 'doctor',
    data: { role: 'doctor' },
    children: [{
      path: 'verify-id', component: VerifyIdComponent,
    }, {
      path: 'review-tc', component: ReviewTcComponent
    }, {
      path: 'basic-info', component: BasicInfoFormComponent
    }, {
      path: 'job-info', component: DoctorJobInfoFormComponent
    }, {
      path: 'review-info', component: ReviewInfoComponent
    }]
  },
  {
    path: 'volunteer', component: VerifyIdComponent,
    data: { role: 'volunteer' },
    children: [{
      path: 'verify-id', component: VerifyIdComponent,
    }, {
      path: 'review-tc', component: ReviewTcComponent
    }]
  },
  { path: 'verify-id', component: VerifyIdComponent },
  { path: 'update-status', component: UpdateStatusComponent },
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: '**', redirectTo: 'main' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
