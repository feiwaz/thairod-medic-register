export interface InitialOption {
  value: number;
  viewValue: string;
}

export const DOCTOR_INITIALS: InitialOption[] = [
  { value: 1, viewValue: 'นายแพทย์' },
  { value: 2, viewValue: 'แพทย์หญิง' },
  { value: 3, viewValue: 'เภสัชกรชาย' },
  { value: 4, viewValue: 'เภสัชกรหญิง' }
];

export const VOLUNTEER_INITIALS: InitialOption[] = [
  { value: 1, viewValue: 'นาย' },
  { value: 2, viewValue: 'นางสาว' },
  { value: 3, viewValue: 'นาง' },
  { value: 4, viewValue: 'เด็กชาย' },
  { value: 5, viewValue: 'เด็กหญิง' }
];