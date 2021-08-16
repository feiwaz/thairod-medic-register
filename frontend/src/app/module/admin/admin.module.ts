import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AccountMenuComponent } from '../../component/account-menu/account-menu.component';
import { AdminMainComponent } from '../../component/admin-main/admin-main.component';
import { ChangePasswordFormComponent } from '../../component/change-password-form/change-password-form.component';
import { ColumnFilterComponent } from '../../component/column-filter/column-filter.component';
import { ManageAccountComponent } from '../../component/manage-account/manage-account.component';
import { ManageRegisteredUserComponent } from '../../component/manage-registered-user/manage-registered-user.component';
import { ManageTrainingStatusComponent } from '../../component/manage-training-status/manage-training-status.component';
import { RegisteredUserListComponent } from '../../component/registered-user-list/registered-user-list.component';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component';
import { UpdateTrainingStatusDialogComponent } from '../../dialog/update-training-status-dialog/update-training-status-dialog.component';
import { UserAccountDialogComponent } from '../../dialog/user-account-dialog/user-account-dialog.component';
import { UserDialogComponent } from '../../dialog/user-dialog/user-dialog.component';
import { VerifyDetailDialogComponent } from '../../dialog/verify-detail-dialog/verify-detail-dialog.component';
import { FullDatetimePipe } from '../../pipe/full-datetime.pipe';
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
    UpdateTrainingStatusDialogComponent,
    FullDatetimePipe
  ],
  imports: [
    SharedModule,
    MatCardModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
