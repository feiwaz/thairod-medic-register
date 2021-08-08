import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class VolunteerDepartmentDto {

  @IsNotEmpty()
  @IsNumber()
  volunteerId: number;

  @IsNotEmpty()
  @IsNumber()
  departmentId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1)
  trainingStatus: number;

}