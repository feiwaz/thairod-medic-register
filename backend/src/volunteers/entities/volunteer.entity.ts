import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Department } from './department.entity';

export enum VolunteerPrename {
  INIT1 = 'นาย',
  INIT2 = 'นางสาว',
  INIT3 = 'นาง',
  INIT4 = 'เด็กชาย',
  INIT5 = 'เด็กหญิง',
}

export enum VolunteerStatus {
  PENDING = 'รอการอนุมัติ',
  APPROVED = 'อนุมัติแล้ว',
}

@Entity()
export class Volunteer {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column({
    type: 'enum',
    enum: VolunteerPrename,
  })
  preName: string;

  @Column()
  name: string;

  @Column()
  surName: string;

  @Column()
  dateOfBirth: Date;

  @Column({
    length: 510,
  })
  address: string;

  @Column()
  tel: string;

  @Column()
  lineId: string;

  @Column()
  medicalId: string;

  @Column()
  jobCertificateImg: string;

  @Column()
  jobCertificateSelfieImg: string;

  @Column()
  nationalCardImg: string;

  @Column()
  nationalCardSelfieImg: string;

  @Column({
    type: 'enum',
    enum: VolunteerStatus,
    default: VolunteerStatus.PENDING,
  })
  status: VolunteerStatus;

  @ManyToMany(() => Department, (department) => department.volunteers, {
    cascade: true,
  })
  @JoinTable({ name: 'volunteer_department' })
  department: Department[];

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;
}