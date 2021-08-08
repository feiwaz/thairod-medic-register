import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { VolunteerDepartmentDto } from "./volunteer-department.dto";

export class VolunteerDepartmentsDto {

  @IsArray()
  @ValidateNested()
  @Type(() => VolunteerDepartmentDto)
  volunteerDepartments: VolunteerDepartmentDto[];

}