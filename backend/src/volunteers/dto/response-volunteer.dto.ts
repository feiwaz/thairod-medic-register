import { FindOneResponseDto } from 'src/base/dto/find-one-response.dto';
import { VolunteerInitial } from '../entities/volunteer.entity';
import { ResponseDepartmentDto } from './response-department.dto';

export class ResponseVolunteerDto extends FindOneResponseDto {
  initial: VolunteerInitial;
  departments: ResponseDepartmentDto[];
}
