import { Department } from '../entities/department.entity';

export class TrainingStatusVolunteerDto {
    id: number;
    passedDepartment: Department[];
    failedDepartment: Department[];
}