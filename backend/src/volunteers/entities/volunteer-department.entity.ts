import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Department } from './department.entity';
import { Volunteer } from './volunteer.entity';

@Entity()
export class VolunteerDepartment {

  @PrimaryColumn()
  volunteerId: number;

  @PrimaryColumn()
  departmentId: number;

  @ManyToOne(
    () => Volunteer,
    volunteer => volunteer.volunteerDepartments,
    { onDelete: 'CASCADE' }
  )
  volunteer: Volunteer;

  @ManyToOne(
    () => Department,
    department => department.volunteerDepartments
  )
  department: Department;

  @Column({ default: 0 })
  trainingStatus: number;

}
