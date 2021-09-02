import { IsNotEmpty } from 'class-validator';

export class TelemedRequestDto {

  userName?: string;

  password?: string;

  userGroup?: string;

  @IsNotEmpty()
  citizenId: string;

  @IsNotEmpty()
  prefix: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  lineId: string;

  @IsNotEmpty()
  telephone: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  gendor: string;

  @IsNotEmpty()
  dateOfBirth: string;

  @IsNotEmpty()
  medicalCertificate: string;

  @IsNotEmpty()
  departmentName: string;

  @IsNotEmpty()
  verifyBy: string;

  @IsNotEmpty()
  verifyDate: string;

  @IsNotEmpty()
  remark: string;

}
