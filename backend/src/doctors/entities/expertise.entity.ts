import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Doctor } from './doctor.entity';

export enum ExpertiseName {
  INIT1 = 'สาขาหนึ่ง',
  INIT2 = 'สาขาสอง',
  INIT3 = 'สาขาสาม',
  INIT4 = 'สาขาสี่',
  INIT5 = 'สาขาห้า',
  INIT6 = 'สาขาหก',
}

@Entity()
export class Expertise {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: ExpertiseName,
  })
  name: string;

  @ManyToMany(() => Doctor, (doctor) => doctor.expertise)
  doctors: Doctor[];
}
