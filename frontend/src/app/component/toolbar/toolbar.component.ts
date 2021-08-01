import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  @Input() previousPath = '.';
  @Input() toolbarTitle = 'ไทยรอด';
  @Input() isLoading = false;
  @Input() navigateBackPath = '';

  constructor(
    private router: Router,
    private location: Location
  ) { }

  onNavigateBack(): void {
    if (this.navigateBackPath) {
      this.router.navigate([this.navigateBackPath]);
    } else {
      this.location.back();
    }
  }

}
