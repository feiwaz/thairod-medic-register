import { FindOneResponseDto } from 'src/base/dto/find-one-response.dto';
import { DoctorInitial } from '../entities/doctor.entity';
import { SpecializedFieldLabel } from '../entities/specialized-field.entity';

export class responseDoctorDto extends FindOneResponseDto {
  initial: DoctorInitial;
  specializedFields: SpecializedFieldLabel[];
}
