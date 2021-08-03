import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { VolunteerDepartment } from './volunteerDepartment.entity';

export enum DepartmentLabel {
  DEPARTMENT1 = 'เเอดมินตอบ LINE',
  DEPARTMENT2 = 'คัดกรอง',
  DEPARTMENT3 = 'ส่งต่อประสานงาน',
  DEPARTMENT4 = 'เฝ้าระวัง',
  DEPARTMENT5 = 'พูดคุยกับผู้ป่วย',
  DEPARTMENT6 = 'IT Support',
  DEPARTMENT7 = 'อบรมอาสาสมัคร',
  DEPARTMENT8 = 'จัดซื้อ/หาของ',
  DEPARTMENT9 = 'ประสานงานเเละเอกสาร',
  DEPARTMENT10 = 'เเพทย์อาสา',
  DEPARTMENT11 = 'เเพคเเละคลัง',
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
