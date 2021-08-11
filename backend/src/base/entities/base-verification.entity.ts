import { VerificationStatus } from "src/enum/verification-status.enum";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { BaseResource } from "./base-resource.entity";

export abstract class BaseVerification extends BaseResource {

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING
  })
  status: VerificationStatus;

  @Column({
    length: 510,
    nullable: true
  })
  statusNote: string;

  @ManyToOne(() => User, verifiedBy => verifiedBy.volunteerVerifications)
  verifiedBy: User;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

}
