import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-review-tc',
  templateUrl: './review-tc.component.html',
  styleUrls: ['./review-tc.component.scss']
})
export class ReviewTcComponent implements OnInit {

  role = '';

  tcForm = this.fb.group({
    consentCheckbox: [false, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.role = data.role || this.role);
  }

  onSubmit(): void {
    this.router.navigate([`/${this.role}/basic-info`]);
  }

}
