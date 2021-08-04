import { NgModule } from '@angular/core';
import { AccountMenuComponent } from 'src/app/component/account-menu/account-menu.component';
import { AdminMainComponent } from 'src/app/component/admin-main/admin-main.component';
import { ChangePasswordFormComponent } from 'src/app/component/change-password-form/change-password-form.component';
import { ColumnFilterComponent } from 'src/app/component/column-filter/column-filter.component';
import { ManageAccountComponent } from 'src/app/component/manage-account/manage-account.component';
import { DeleteDialogComponent } from 'src/app/dialog/delete-dialog/delete-dialog.component';
import { UserAccountDialogComponent } from 'src/app/dialog/user-account-dialog/user-account-dialog.component';
import { UserDialogComponent } from 'src/app/dialog/user-dialog/user-dialog.component';
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
    UserAccountDialogComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
