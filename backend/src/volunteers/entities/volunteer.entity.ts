import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { VolunteerDepartment } from './volunteerDepartment.entity';

export enum VolunteerInitial {
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
    enum: VolunteerInitial,
  })
  initial: string;

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
    enum: VolunteerStatus,
    default: VolunteerStatus.PENDING,
  })
  status: VolunteerStatus;

  // @ManyToMany(() => Department, (department) => department.volunteers, {
  //   cascade: true,
  // })
  // @JoinTable()
  // departments: Department[];

  @OneToMany(
    () => VolunteerDepartment,
    volunteerDepartment => volunteerDepartment.volunteer,
    { cascade: true }
  )
  volunteerDepartment: VolunteerDepartment[];

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

}
