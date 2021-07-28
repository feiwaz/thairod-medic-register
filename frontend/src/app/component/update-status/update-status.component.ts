import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss']
})
export class UpdateStatusComponent implements OnInit {

  id = '';
  status = 'pending';

  constructor(private router: Router) {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation) {
      this.id = currentNavigation.extras.state?.id || this.id;
      this.status = currentNavigation.extras.state?.status || this.status;
    }
  }

  ngOnInit(): void {
  }

  onBackToMain(): void {
    this.router.navigate(['main']);
  }

}
