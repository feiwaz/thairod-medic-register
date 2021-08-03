import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { Department, DepartmentLabel } from '../entities/department.entity';
import {
  VolunteerInitial,
  VolunteerStatus,
} from '../entities/volunteer.entity';

export class CreateVolunteerDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1000000000000, { message: 'id must be equal to 13 characters' })
  @Max(9999999999999, { message: 'id must be equal to 13 characters' })
  id: string;

  @IsNotEmpty()
  @IsEnum(VolunteerInitial, {
    message: 'initial must be like นาย, นางสาว, นาง, เด็กชาย, เด็กหญิง',
  })
  initial: VolunteerInitial;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  contactNumber: string;

  @IsNotEmpty()
  lineId: string;

  @IsNumber()
  @Min(10000, { message: 'medCertificateId must be equal to 13 characters' })
  @Max(99999, { message: 'medCertificateId must be equal to 13 characters' })
  medCertificateId: number;

  // @IsNotEmpty() TODO: Will bring back later
  jobCertificateImg: string;

  // @IsNotEmpty() TODO: Will bring back later
  jobCertificateSelfieImg: string;

  // @IsNotEmpty() TODO: Will bring back later
  idCardImg: string;

  // @IsNotEmpty() TODO: Will bring back later
  idCardSelfieImg: string;

  @IsOptional()
  @IsEnum(VolunteerStatus, {
    message: 'status must be like รอการอนุมัติ, อนุมัติแล้ว',
  })
  status: VolunteerStatus;

  //can insert with only id field
  @IsNotEmpty()
  @IsEnum(DepartmentLabel, {
    message:
      'department must be like เเอดมินตอบ LINE,คัดกรอง,ส่งต่อประสานงาน,เฝ้าระวัง,พูดคุยกับผู้ป่วย,IT Support,อบรวมอาสาสมัคร,จัดซื้อ/หาของ,ประสานงานเเละเอกสาร,เเพทย์อาสา,เเพคเเละคลัง',
    each: true,
  })
  department: Department[];
}
