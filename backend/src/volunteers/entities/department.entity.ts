import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { VolunteerDepartment } from './volunteerDepartment.entity';

export enum DepartmentLabel {
  INIT1 = 'สาขาหนึ่ง',
  INIT2 = 'สาขาสอง',
  INIT3 = 'สาขาสาม',
  INIT4 = 'สาขาสี่',
  INIT5 = 'สาขาห้า',
  INIT6 = 'อื่นๆ',
}

@Entity()
export class Department {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: DepartmentLabel,
  })
  label: DepartmentLabel;

  @OneToMany(
    () => VolunteerDepartment,
    (volunteerDepartment) => volunteerDepartment.department,
    { cascade: true },
  )
  volunteerDepartment: VolunteerDepartment[];

  @Column({ default: false })
  isTrainingRequired: boolean;

  // @ManyToMany(() => Volunteer, (volunteer) => volunteer.department)
  // volunteers: Volunteer[];
}
