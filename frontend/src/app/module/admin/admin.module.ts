import { NgModule } from '@angular/core';
import { AccountMenuComponent } from 'src/app/component/account-menu/account-menu.component';
import { AdminMainComponent } from 'src/app/component/admin-main/admin-main.component';
import { SharedModule } from '../shared.module';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [
    AccountMenuComponent,
    AdminMainComponent
  ],
  entryComponents: [],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
