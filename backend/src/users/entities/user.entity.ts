import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

export enum UserInitial {
  INIT1 = 'นาย',
  INIT2 = 'นางสาว',
  INIT3 = 'นาง',
  INIT4 = 'เด็กชาย',
  INIT5 = 'เด็กหญิง'
}

export enum UserStatus {
  PENDING = 'รอการอนุมัติ',
  APPROVED = 'อนุมัติแล้ว'
}

@Entity()
export class User {

  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column({
    type: 'enum',
    enum: UserInitial
  })
  initial: UserInitial;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  dateOfBirth: string;

  @Column()
  address: string;

  @Column()
  contactNumber: string;

  @Column()
  lineId: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING
  })
  status: UserStatus;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

}