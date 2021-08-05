import { InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserStatus {
  PENDING = 'รอการอนุมัติ',
  APPROVED = 'อนุมัติแล้ว',
  DENIED = 'ไม่อนุมัติ'
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  private tempPassword: string;

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      if (this.tempPassword !== this.password) {
        try {
          const salt = await bcrypt.genSalt();
          this.password = await bcrypt.hash(this.password, salt);
        } catch (e) {
          throw new InternalServerErrorException('Unable to hash password')
        }
      }
    }
  }

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  contactNumber: string;

  @Column({
    type: 'enum',
    enum: UserRole
  })
  role: UserRole;

  @Column()
  isActive: boolean;

  @CreateDateColumn({ select: false })
  createdTime: Date;

  @UpdateDateColumn({ select: false })
  updatedTime: Date;

  @OneToOne(() => User, user => user.id)
  createdBy: User;

}