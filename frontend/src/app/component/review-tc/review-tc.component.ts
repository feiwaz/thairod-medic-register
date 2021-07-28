import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-review-tc',
  templateUrl: './review-tc.component.html',
  styleUrls: ['./review-tc.component.scss']
})
export class ReviewTcComponent implements OnInit {

  role = '';

  tcForm = new FormGroup({
    consentCheckbox: new FormControl({ value: false, disabled: false }, Validators.required)
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      if (data.role) this.role = data.role;
    });
  }

  onSubmit(): void {
    this.router.navigate([`/${this.role}/basic-info`]);
  }

}
