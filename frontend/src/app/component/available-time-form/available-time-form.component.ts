import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicInfo } from '../../model/basic-info.model';

interface dayOption {
  value: string;
  viewValue: string;
}

interface SelectOption {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-available-time-form',
  templateUrl: './available-time-form.component.html',
  styleUrls: ['./available-time-form.component.scss']
})
export class AvailableTimeFormComponent implements OnInit {

  isFormValid = false;
  role = '';
  days: dayOption[] = [
    { value: 'monday', viewValue: 'จันทร์' },
    { value: 'tuesday', viewValue: 'อังคาร' },
    { value: 'wednesday', viewValue: 'พุธ' },
    { value: 'thursday', viewValue: 'พฤหัสบดี' },
    { value: 'friday', viewValue: 'ศุกร์' },
    { value: 'saturday', viewValue: 'เสาร์' },
    { value: 'sunday', viewValue: 'อาทิตย์' }
  ];
  shifts: SelectOption[] = [
    { value: 0, viewValue: 'ไม่สะดวก' },
    { value: 1, viewValue: 'ทั้งวัน (07:00 ถึง 18:00 น.)' },
    { value: 2, viewValue: 'เช้า (07:00 ถึง 12:00 น.)' },
    { value: 3, viewValue: 'บ่าย (13:00 ถึง 18:00 น.)' }
  ];

  availableTimeForm = this.fb.group({});

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.days.forEach(day => this.availableTimeForm.addControl(day.value, this.fb.control(0)));
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => this.role = data.role || this.role);
    this.checkIfFormValidAndSubscribeChanges();
    this.patchValue();
  }

  private checkIfFormValidAndSubscribeChanges() {
    this.availableTimeForm.valueChanges.subscribe(formControl => {
      const isInvalid = Object.values(formControl).every(value => value === 0);
      this.isFormValid = !isInvalid;
    });
  }

  private patchValue() {
    let basicInfoString = sessionStorage.getItem(`${this.role}BasicInfo`);
    if (basicInfoString) {
      const { availableTimes } = JSON.parse(basicInfoString) as BasicInfo;
      if (availableTimes) {
        availableTimes.forEach((availableTime: string) => {
          const viewValues = availableTime.split(' - ');
          const day = this.days.find(day => day.viewValue === viewValues[0]);
          const shift = this.shifts.find(shift => shift.viewValue === viewValues[1]);
          if (day) {
            this.availableTimeForm.controls[day.value].setValue(shift?.value);
          }
        });
      }
    }
  }

  onSubmit(): void {
    let availableTimes: string[] = this.buildAvailableTimes();
    this.saveToSessionStorage(availableTimes);
    this.router.navigate([`/${this.role}/review-info`]);
  }

  private saveToSessionStorage(availableTimes: string[]) {
    let basicInfoString = sessionStorage.getItem(`${this.role}BasicInfo`);
    if (basicInfoString) {
      let basicInfo = JSON.parse(basicInfoString) as BasicInfo;
      basicInfo = Object.assign(basicInfo, { availableTimes });
      sessionStorage.setItem(`${this.role}BasicInfo`, JSON.stringify(basicInfo));
    }
  }

  private buildAvailableTimes() {
    let availableTimes: string[] = [];
    this.days.forEach(day => {
      const selectedShift = this.shifts.find(shift => {
        const availableTimeValue = this.availableTimeForm.controls[day.value].value;
        if (!availableTimeValue) {
          return false;
        }
        return availableTimeValue === shift.value;
      });

      if (selectedShift) {
        availableTimes.push(`${day.viewValue} - ${selectedShift?.viewValue}`);
      }
    });
    return availableTimes;
  }

  nonZeroValueValidator(): ValidatorFn | ValidatorFn[] | AbstractControlOptions | null | undefined {
    throw new Error('Function not implemented.');
  }

}
