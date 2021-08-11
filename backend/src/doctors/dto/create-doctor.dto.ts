import { IsEnum, IsNotEmpty } from 'class-validator';
import { BaseCreateRegistrationDto } from 'src/base/dto/base-create-registration.dto';
import { DoctorInitial } from '../entities/doctor.entity';
import { SpecializedFieldLabel } from '../entities/specialized-field.entity';

export class CreateDoctorDto extends BaseCreateRegistrationDto {

  @IsNotEmpty()
  @IsEnum(DoctorInitial, {
    message: `initial must be like ${Object.values(DoctorInitial).join(', ')}`
  })
  initial: DoctorInitial;

  @IsNotEmpty()
  medCertificateId: number;

  @IsNotEmpty()
  @IsEnum(SpecializedFieldLabel, {
    message: `specializedFields must be like ${Object.values(SpecializedFieldLabel).join(', ')}`,
    each: true
  })
  specializedFields: SpecializedFieldLabel[];

}
