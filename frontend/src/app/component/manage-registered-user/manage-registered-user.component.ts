import { Component, OnInit } from '@angular/core';
import { WorkspaceService } from 'src/app/service/workspace.service';

@Component({
  selector: 'app-manage-registered-user',
  templateUrl: './manage-registered-user.component.html',
  styleUrls: ['./manage-registered-user.component.scss']
})
export class ManageRegisteredUserComponent implements OnInit {

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {
    this.workspaceService.save();
  }

}
