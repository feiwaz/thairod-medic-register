import { NgModule } from '@angular/core';
import { AccountMenuComponent } from 'src/app/component/account-menu/account-menu.component';
import { AdminMainComponent } from 'src/app/component/admin-main/admin-main.component';
import { ChangePasswordFormComponent } from 'src/app/component/change-password-form/change-password-form.component';
import { ColumnFilterComponent } from 'src/app/component/column-filter/column-filter.component';
import { ManageAccountComponent } from 'src/app/component/manage-account/manage-account.component';
import { ManageRegisteredUserComponent } from 'src/app/component/manage-registered-user/manage-registered-user.component';
import { ManageTrainingStatusComponent } from 'src/app/component/manage-training-status/manage-training-status.component';
import { RegisteredUserListComponent } from 'src/app/component/registered-user-list/registered-user-list.component';
import { DeleteDialogComponent } from 'src/app/dialog/delete-dialog/delete-dialog.component';
import { UpdateTrainingStatusDialogComponent } from 'src/app/dialog/update-training-status-dialog/update-training-status-dialog.component';
import { UserAccountDialogComponent } from 'src/app/dialog/user-account-dialog/user-account-dialog.component';
import { UserDialogComponent } from 'src/app/dialog/user-dialog/user-dialog.component';
import { VerifyDetailDialogComponent } from 'src/app/dialog/verify-detail-dialog/verify-detail-dialog.component';
import { SharedModule } from '../shared.module';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [
    AccountMenuComponent,
    AdminMainComponent,
    ManageAccountComponent,
    UserDialogComponent,
    DeleteDialogComponent,
    ColumnFilterComponent,
    ChangePasswordFormComponent,
    UserAccountDialogComponent,
    ManageRegisteredUserComponent,
    RegisteredUserListComponent,
    VerifyDetailDialogComponent,
    ManageTrainingStatusComponent,
    UpdateTrainingStatusDialogComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
