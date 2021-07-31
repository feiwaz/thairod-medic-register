import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { VolunteerDepartment } from './volunteerDepartment.entity';

export enum DepartmentName {
  INIT1 = 'สาขาหนึ่ง',
  INIT2 = 'สาขาสอง',
  INIT3 = 'สาขาสาม',
  INIT4 = 'สาขาสี่',
  INIT5 = 'สาขาห้า',
  INIT6 = 'สาขาหก',
}

@Entity()
export class Department {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: DepartmentName,
  })
  name: string;

  @OneToMany(
    () => VolunteerDepartment,
    (volunteerDepartment) => volunteerDepartment.department,
    {
      cascade: true,
    },
  )
  volunteerDepartment: VolunteerDepartment[];

  @Column({
    default: false,
  })
  isRequireTraining: boolean;

  // @ManyToMany(() => Volunteer, (volunteer) => volunteer.department)
  // volunteers: Volunteer[];
}
