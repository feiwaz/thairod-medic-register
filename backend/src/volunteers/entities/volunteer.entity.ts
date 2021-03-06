import { BaseRegistration } from 'src/base/entities/base-registration.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { VolunteerDepartment } from './volunteer-department.entity';
import { VolunteerVerification } from './volunteer-verification.entity';

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
  DENIED = 'ไม่อนุมัติ'
}

@Entity()
@Unique(['firstName', 'lastName'])
export class Volunteer extends BaseRegistration {

  @Column({
    type: 'enum',
    enum: VolunteerInitial,
  })
  initial: string;

  @Column({
    nullable: true,
    unique: true
  })
  medCertificateId: number;

  @OneToMany(
    () => VolunteerVerification,
    volunteerVerification => volunteerVerification.volunteer
  )
  volunteerVerifications: VolunteerVerification[];

  @OneToMany(
    () => VolunteerDepartment,
    volunteerDepartment => volunteerDepartment.volunteer,
    { cascade: true }
  )
  volunteerDepartments: VolunteerDepartment[];

}
