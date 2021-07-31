import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Volunteer } from './volunteer.entity';

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

  @ManyToMany(() => Volunteer, (volunteer) => volunteer.department)
  volunteers: Volunteer[];
}
