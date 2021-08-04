import { Department } from '../entities/department.entity';

export class TrainingStatusVolunteerDto {
    id: string;
    passedDepartment: Department[];
    failedDepartment: Department[];
}