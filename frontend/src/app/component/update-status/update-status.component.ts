import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss']
})
export class UpdateStatusComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onBackToMain(): void {
    this.router.navigate(['main']);
  }

}
