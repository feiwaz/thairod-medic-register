import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-tc',
  templateUrl: './review-tc.component.html',
  styleUrls: ['./review-tc.component.scss']
})
export class ReviewTcComponent implements OnInit {

  tcForm = new FormGroup({
    consentCheckbox: new FormControl({ value: false, disabled: false }, Validators.required)
  });

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void {
  }

}
