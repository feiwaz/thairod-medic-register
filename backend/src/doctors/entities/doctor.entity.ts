import { BaseRegistration } from 'src/base/entities/base-registration.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, Unique } from 'typeorm';
import { DoctorVerification } from './doctor-verification.entity';
import { SpecializedField } from './specialized-field.entity';

export enum DoctorInitial {
  INIT1 = 'นายแพทย์',
  INIT2 = 'แพทย์หญิง',
  INIT3 = 'เภสัชกรชาย',
  INIT4 = 'เภสัชกรหญิง',
}

@Entity()
@Unique(['firstName', 'lastName'])
export class Doctor extends BaseRegistration {

  @Column({
    type: 'enum',
    enum: DoctorInitial,
  })
  initial: DoctorInitial;

  @Column({ unique: true })
  medCertificateId: number;

  @OneToMany(
    () => DoctorVerification,
    doctorVerification => doctorVerification.doctor
  )
  doctorVerifications: DoctorVerification[];

  @ManyToMany(
    () => SpecializedField,
    specializedField => specializedField.doctors,
    { cascade: true }
  )
  @JoinTable()
  specializedFields: SpecializedField[];

}
