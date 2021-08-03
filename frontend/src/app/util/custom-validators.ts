import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {

  static compareConfirmPassword(control: AbstractControl): any {
    const passwordControl = control.get('password') as FormControl;
    const confirmPasswordControl = control.get('confirmPassword') as FormControl;
    confirmPasswordControl.setErrors(passwordControl.value !== confirmPasswordControl.value ? { passwordMismatch: true } : null);
  }

  static passwordMatchValidator(formGroup: AbstractControl): ValidationErrors {
    return formGroup.get('password')?.value === formGroup.get('confirmPassword')?.value ? {} : { passwordMismatch: true };
  }

}

/*
Courtesy of https://codinglatte.com/posts/angular/cool-password-validation-angular
*/
