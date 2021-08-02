import { Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Doctor } from './doctor.entity';

export enum SpecializedFieldLabel {
  FIELD1 = 'เวชปฏิบัติทั่วไป',
  FIELD2 = 'สูตินรีเวช',
  FIELD3 = 'อายุรกรรม',
  FIELD4 = 'ศัลยกรรม',
  FIELD5 = 'กุมารเวช',
  FIELD6 = 'อื่นๆ'
}

@Entity()
export class SpecializedField {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: SpecializedFieldLabel,
    unique: true
  })
  label: SpecializedFieldLabel;

  @ManyToMany(
    () => Doctor,
    doctor => doctor.specializedFields
  )
  doctors: Doctor[];

}
