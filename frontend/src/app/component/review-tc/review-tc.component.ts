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
  id = '';

  tcForm = this.fb.group({
    consentCheckbox: [false, Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation) {
      this.id = currentNavigation.extras.state?.id || this.id;
    }
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.role = data.role || this.role);
  }

  onSubmit(): void {
    this.router.navigate([`/${this.role}/basic-info`], {
      state: { id: this.id }
    });
  }

}
