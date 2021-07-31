import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Volunteer } from './volunteer.entity';
import { Department } from './department.entity';

@Entity()
export class VolunteerDepartment {
  @PrimaryColumn({ type: 'bigint' })
  volunteerId: string;

  @PrimaryColumn()
  departmentId: number;

  @ManyToOne(() => Volunteer, (volunteer) => volunteer.volunteerDepartment, {
    onDelete: 'CASCADE',
  })
  volunteer: Volunteer;

  @ManyToOne(() => Department, (department) => department.volunteerDepartment)
  department: Department;

  @Column({
    default: 1,
  })
  trainingStatus: number;
}
