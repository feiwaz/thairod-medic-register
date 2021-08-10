import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(private router: Router) { }

  getLastVisitedUrl(): string {
    return this.getWorkspace().lastVisitedUrl;
  }

  save(option?: any) {
    let toSave = { lastVisitedUrl: this.router.url };
    if (option && Object.keys(option).length !== 0) {
      let workspace = this.getWorkspace();
      Object.keys(option).forEach(key => workspace[key] = { ...workspace[key], ...option[key] });
      toSave = { ...workspace, ...toSave };
    } else {
      toSave = { ...this.getWorkspace(), ...toSave };
    }
    localStorage.setItem('workspace', JSON.stringify(toSave));
  }

  getWorkspace() {
    let workspace = { lastVisitedUrl: '' } as any;
    const workspaceString = localStorage.getItem('workspace');
    if (workspaceString) {
      workspace = JSON.parse(workspaceString);
    }
    return workspace;
  }

}
