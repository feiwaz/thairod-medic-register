export interface GenderOption {
  value: 'Male' | 'Female' | 'LGBT';
  viewValue: 'ชาย' | 'หญิง' | 'ไม่ระบุ';
}

export const GENDERS = [
  { value: 'Male', viewValue: 'ชาย' },
  { value: 'Female', viewValue: 'หญิง' },
  { value: 'LGBT', viewValue: 'ไม่ระบุ' }
];
