import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './component/main/main.component';
import { ReviewTcComponent } from './component/review-tc/review-tc.component';
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
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: '**', redirectTo: 'main' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
