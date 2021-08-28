export interface GenderOption {
  value: 'Male' | 'Female' | 'LGBT';
  viewValue: 'ชาย' | 'หญิง' | 'อื่นๆ (LGBT)';
}

export const GENDERS = [
  { value: 'Male', viewValue: 'ชาย' },
  { value: 'Female', viewValue: 'หญิง' },
  { value: 'LGBT', viewValue: 'อื่นๆ (LGBT)' }
];
