import { FindOneResponseDto } from 'src/base/dto/find-one-response.dto';
import { VolunteerInitial } from '../entities/volunteer.entity';

export class ResponseVolunteerDto extends FindOneResponseDto {
  initial: VolunteerInitial;
  departments: string[];
}
