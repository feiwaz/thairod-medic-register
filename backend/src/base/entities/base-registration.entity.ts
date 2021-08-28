import { VerificationStatus } from 'src/enum/verification-status.enum';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Gender } from '../../enum/gender.enum';
import { BaseResource } from './base-resource.entity';

export abstract class BaseRegistration extends BaseResource {

  @Column({
    type: 'bigint',
    unique: true
  })
  nationalId: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE
  })
  gender: Gender

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  dateOfBirth: Date;

  @Column({ length: 510 })
  address: string;

  @Column({ unique: true })
  contactNumber: string;

  @Column({ unique: true })
  lineId: string;

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
    enum: VerificationStatus,
    default: VerificationStatus.PENDING
  })
  status: VerificationStatus;

  @Column({ length: 510 })
  availableTimes: string;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

}
