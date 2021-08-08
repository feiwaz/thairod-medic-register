import { NgModule } from '@angular/core';
import { AccountMenuComponent } from 'src/app/component/account-menu/account-menu.component';
import { AdminMainComponent } from 'src/app/component/admin-main/admin-main.component';
import { ChangePasswordFormComponent } from 'src/app/component/change-password-form/change-password-form.component';
import { ColumnFilterComponent } from 'src/app/component/column-filter/column-filter.component';
import { ManageAccountComponent } from 'src/app/component/manage-account/manage-account.component';
import { ManageRegisteredUserComponent } from 'src/app/component/manage-registered-user/manage-registered-user.component';
import { TableListComponent } from 'src/app/component/manage-registered-user/verify-list/table-list/table-list.component';
import { VerifyListComponent } from 'src/app/component/manage-registered-user/verify-list/verify-list.component';
import { DeleteDialogComponent } from 'src/app/dialog/delete-dialog/delete-dialog.component';
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
    VerifyListComponent,
    TableListComponent,
    VerifyDetailDialogComponent
  ],
  entryComponents: [
    UserDialogComponent,
    DeleteDialogComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
