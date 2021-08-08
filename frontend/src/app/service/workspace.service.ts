import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(private router: Router) { }

  getLastVisitedUrl(): string {
    return this.getWorkspace().lastVisitedUrl || '';
  }

  save(option?: any) {
    let toSave = { lastVisitedUrl: this.router.url };
    if (option && Object.keys(option).length !== 0) {
      toSave = { ...toSave, ...option };
    } else {
      toSave = { ...this.getWorkspace(), ...toSave };
    }
    localStorage.setItem('workspace', JSON.stringify(toSave));
  }

  getWorkspace() {
    let workspace = null;
    const workspaceString = localStorage.getItem('workspace');
    if (workspaceString) {
      workspace = JSON.parse(workspaceString);
    }
    return workspace;
  }

}
