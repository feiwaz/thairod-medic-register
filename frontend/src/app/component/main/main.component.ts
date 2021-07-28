import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onRegister(role = 'volunteer'): void {
    this.router.navigate([`/${role}/verify-id`]);
  }

  onCheckStatus(): void {
    this.router.navigate(['verify-id']);
  }

}
