import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Doctor } from './doctor.entity';

export enum SpecializedLabel {
  INIT1 = 'สาขาหนึ่ง',
  INIT2 = 'สาขาสอง',
  INIT3 = 'สาขาสาม',
  INIT4 = 'สาขาสี่',
  INIT5 = 'สาขาห้า',
  INIT6 = 'สาขาหก',
}

@Entity()
export class SpecializedField {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: SpecializedLabel,
  })
  label: SpecializedLabel;

  @ManyToMany(() => Doctor, (doctor) => doctor.specializedField)
  doctors: Doctor[];

}
