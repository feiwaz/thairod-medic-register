import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from 'src/app/component/admin-main/admin-main.component';
import { ManageAccountComponent } from 'src/app/component/manage-account/manage-account.component';
import { ManageRegisteredUserComponent } from 'src/app/component/manage-registered-user/manage-registered-user.component';
import { ManageTrainingStatusComponent } from 'src/app/component/manage-training-status/manage-training-status.component';

const routes: Routes = [{
  path: '', component: AdminMainComponent,
  children: [{
    // TODO: add guard here if only admin allowed to access /manage-account
    // canLoad: [AuthGuard],
    // canActivate: [AuthGuard]
    path: 'manage-account', component: ManageAccountComponent
  }, {
    path: 'manage-registered-user', component: ManageRegisteredUserComponent
  }, {
    path: 'manage-training-status', component: ManageTrainingStatusComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
