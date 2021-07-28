import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() previousPath = '.';
  @Input() toolbarTitle = 'ไทยรอด';
  @Input() isLoading = false;

  constructor(private router: Router, private location: Location) { }

  ngOnInit(): void {
  }

  onNavigateBack(): void {
    // this.router.navigate([this.previousPath], { skipLocationChange: false });
    this.location.back();
  }

}
