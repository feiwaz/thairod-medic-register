import { VerificationStatus } from 'src/enum/verification-status.enum';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseResource } from './base-resource.entity';

export abstract class BaseRegistration extends BaseResource {

  @Column({
    type: 'bigint',
    unique: true
  })
  nationalId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  dateOfBirth: Date;

  @Column({
    length: 510
  })
  address: string;

  @Column()
  contactNumber: string;

  @Column()
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

  @Column('simple-array', { nullable: true })
  availableTimes: string[];

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

}
