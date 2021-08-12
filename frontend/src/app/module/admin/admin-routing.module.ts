import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from '../../component/admin-main/admin-main.component';
import { ManageAccountComponent } from '../../component/manage-account/manage-account.component';
import { ManageRegisteredUserComponent } from '../../component/manage-registered-user/manage-registered-user.component';
import { ManageTrainingStatusComponent } from '../../component/manage-training-status/manage-training-status.component';

const routes: Routes = [{
  path: '', component: AdminMainComponent,
  children: [{
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
