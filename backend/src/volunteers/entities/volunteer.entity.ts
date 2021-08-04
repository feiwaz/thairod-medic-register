import { UserStatus } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { VolunteerDepartment } from './volunteerDepartment.entity';

export enum VolunteerInitial {
  INIT1 = 'นาย',
  INIT2 = 'นางสาว',
  INIT3 = 'นาง',
  INIT4 = 'เด็กชาย',
  INIT5 = 'เด็กหญิง',
}

@Entity()
export class Volunteer {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'bigint',
    unique: true
  })
  nationalId: string;

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

  @Column({ nullable: true })
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
    enum: UserStatus,
    default: UserStatus.PENDING
  })
  status: UserStatus;

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
  volunteerDepartments: VolunteerDepartment[];

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

}
