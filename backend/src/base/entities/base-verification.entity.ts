import { VerificationStatus } from "src/enum/verification-status.enum";
import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
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

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

}
