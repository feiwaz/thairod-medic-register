import { NgModule } from '@angular/core';
import { AccountMenuComponent } from 'src/app/component/account-menu/account-menu.component';
import { AdminMainComponent } from 'src/app/component/admin-main/admin-main.component';
import { ColumnFilterComponent } from 'src/app/component/column-filter/column-filter.component';
import { ManageAccountComponent } from 'src/app/component/manage-account/manage-account.component';
import { SharedModule } from '../shared.module';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [
    AccountMenuComponent,
    AdminMainComponent,
    ManageAccountComponent,
    ColumnFilterComponent
  ],
  entryComponents: [],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
