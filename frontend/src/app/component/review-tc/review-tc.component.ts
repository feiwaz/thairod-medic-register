import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-review-tc',
  templateUrl: './review-tc.component.html',
  styleUrls: ['./review-tc.component.scss']
})
export class ReviewTcComponent {

  role = '';
  nationalId = '';

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
      this.nationalId = currentNavigation.extras.state?.nationalId || this.nationalId;
    }
    this.route.data.subscribe(data => this.role = data.role || this.role);
  }

  onSubmit(): void {
    this.router.navigate([`/${this.role}/basic-info`], {
      state: { nationalId: this.nationalId }
    });
  }

  get basicInfoPath(): string {
    return `/${this.role}/verify-id`;
  }

}
