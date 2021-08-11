import {
  IsEnum,
  IsNotEmpty, IsOptional
} from 'class-validator';
import { BaseCreateRegistrationDto } from 'src/base/dto/base-create-registration.dto';
import { Department, DepartmentLabel } from '../entities/department.entity';
import { VolunteerInitial } from '../entities/volunteer.entity';

export class CreateVolunteerDto extends BaseCreateRegistrationDto {

  @IsNotEmpty()
  @IsEnum(VolunteerInitial, {
    message: `initial must be like ${Object.values(VolunteerInitial).join(', ')}`
  })
  initial: VolunteerInitial;

  @IsOptional()
  medCertificateId: number;

  @IsNotEmpty()
  @IsEnum(DepartmentLabel, {
    message: `departments must be like ${Object.values(DepartmentLabel).join(', ')}`,
    each: true,
  })
  departments: Department[];

}
