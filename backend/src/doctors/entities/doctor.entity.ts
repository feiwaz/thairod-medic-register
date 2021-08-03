import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { SpecializedField } from './specializedField.entity';

export enum DoctorInitial {
  INIT1 = 'นายแพทย์',
  INIT2 = 'แพทย์หญิง',
  INIT3 = 'เภสัชกรชาย',
  INIT4 = 'เภสัชกรหญิง',
}

export enum DoctorStatus {
  PENDING = 'รอการอนุมัติ',
  APPROVED = 'อนุมัติแล้ว',
  DENIED = 'ไม่อนุมัติ'
}

@Entity()
export class Doctor {

  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column({
    type: 'enum',
    enum: DoctorInitial,
  })
  initial: DoctorInitial;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  dateOfBirth: Date;

  @Column({
    length: 510,
  })
  address: string;

  @Column()
  contactNumber: string;

  @Column()
  lineId: string;

  @Column()
  medCertificateId: number;

  @Column({ nullable: true })
  jobCertificateImg: string;

  @Column({ nullable: true })
  jobCertificateSelfieImg: string;

  @Column({ nullable: true })
  idCardImg: string;

  @Column({ nullable: true })
  idCardSelfieImg: string;

  @Column({
    type: 'enum',
    enum: DoctorStatus,
    default: DoctorStatus.PENDING,
  })
  status: DoctorStatus;

  @ManyToMany(
    () => SpecializedField,
    specializedField => specializedField.doctors,
    { cascade: true }
  )
  @JoinTable()
  specializedFields: SpecializedField[];

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

}
