import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Expertise } from './expertise.entity';

export enum DoctorPrename {
  INIT1 = 'นายแพทย์',
  INIT2 = 'แพทย์หญิง',
  INIT3 = 'เภสัชกรชาย',
  INIT4 = 'เภสัชกรหญิง',
}

export enum DoctorStatus {
  PENDING = 'รอการอนุมัติ',
  APPROVED = 'อนุมัติแล้ว',
}

@Entity()
export class Doctor {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column({
    type: 'enum',
    enum: DoctorPrename,
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
    enum: DoctorStatus,
    default: DoctorStatus.PENDING,
  })
  status: DoctorStatus;

  @ManyToMany(() => Expertise, (expertise) => expertise.doctors, {
    cascade: true,
  })
  @JoinTable({ name: 'doctor_expertise' })
  expertise: Expertise[];

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;
}
