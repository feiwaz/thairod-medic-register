import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from 'src/app/component/admin-main/admin-main.component';

const routes: Routes = [{
  path: '', component: AdminMainComponent,
  children: [{
    path: 'main', component: AdminMainComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
