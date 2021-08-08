import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(private router: Router) { }

  getLastVisitedUrl(): string {
    let lastVisitedUrl = '';
    const workspaceString = localStorage.getItem('workspace');
    if (workspaceString) {
      const workspace = JSON.parse(workspaceString);
      lastVisitedUrl = workspace.lastVisitedUrl || '';
    }
    return lastVisitedUrl;
  }

  save() {
    localStorage.setItem('workspace', JSON.stringify({ lastVisitedUrl: this.router.url }));
  }

}
