import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { VolunteerDepartment } from './volunteer-department.entity';

export enum DepartmentLabel {
  DEP1 = 'แอดมินตอบ LINE',
  DEP2 = 'คัดกรอง',
  DEP3 = 'ส่งต่อประสานงาน',
  DEP4 = 'เฝ้าระวัง',
  DEP5 = 'พูดคุยกับผู้ป่วย',
  DEP6 = 'IT Support',
  DEP7 = 'อบรมอาสาสมัคร',
  DEP8 = 'จัดซื้อ/หาของ',
  DEP9 = 'ประสานงานและเอกสาร',
  DEP10 = 'แพทย์อาสา',
  DEP11 = 'แพคและคลัง'
}

@Entity()
export class Department {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: DepartmentLabel,
    unique: true
  })
  label: DepartmentLabel;

  @OneToMany(
    () => VolunteerDepartment,
    (volunteerDepartment) => volunteerDepartment.department,
    { cascade: true },
  )
  volunteerDepartments: VolunteerDepartment[];

  @Column({ default: false })
  isTrainingRequired: boolean;

}
