import { Component, OnInit } from '@angular/core';
import { WorkspaceService } from 'src/app/service/workspace.service';

@Component({
  selector: 'app-manage-registered-user',
  templateUrl: './manage-registered-user.component.html',
  styleUrls: ['./manage-registered-user.component.scss']
})
export class ManageRegisteredUserComponent implements OnInit {

  selectedIndex = 0;

  constructor(
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {
    const workspace = this.workspaceService.getWorkspace();
    if (workspace && workspace.manageRegisteredUser != null) {
      this.selectedIndex = workspace.manageRegisteredUser.selectedIndex;
    }
    this.workspaceService.save({
      manageRegisteredUser: { selectedIndex: this.selectedIndex }
    });
  }

  onSelectedTabChange(selectedIndex: number): void {
    this.workspaceService.save({
      manageRegisteredUser: { selectedIndex }
    });
  }

}
