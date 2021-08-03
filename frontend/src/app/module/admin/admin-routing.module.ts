import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from 'src/app/component/admin-main/admin-main.component';
import { ManageAccountComponent } from 'src/app/component/manage-account/manage-account.component';
import { ManageRegisteredUserComponent } from 'src/app/component/manage-registered-user/manage-registered-user.component';

const routes: Routes = [{
  path: '', component: AdminMainComponent,
  children: [{
    path: 'manage-account', component: ManageAccountComponent,
    // TODO: add manage-training-status component here
  },
  {
    path: 'manage-registered-user', component: ManageRegisteredUserComponent
  }
  // TODO: add manage-training-status component here
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
