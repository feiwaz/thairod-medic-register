import { InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { BaseResource } from "src/base/entities/base-resource.entity";
import { DoctorVerification } from "src/doctors/entities/doctor-verification.entity";
import { VolunteerVerification } from "src/volunteers/entities/volunteer-verification.entity";
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, OneToOne, Unique, UpdateDateColumn } from "typeorm";

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
@Unique(['firstName', 'lastName'])
export class User extends BaseResource {

  @Column({ unique: true })
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

  @Column({ unique: true })
  contactNumber: string;

  @Column({
    type: 'enum',
    enum: UserRole
  })
  role: UserRole;

  @Column()
  isActive: boolean;

  @OneToMany(
    () => DoctorVerification,
    doctorVerification => doctorVerification.verifiedBy,
    { cascade: true }
  )
  doctorVerifications: DoctorVerification[];

  @OneToMany(
    () => VolunteerVerification,
    volunteerVerification => volunteerVerification.verifiedBy,
    { cascade: true }
  )
  volunteerVerifications: VolunteerVerification[];

  @CreateDateColumn({ select: false })
  createdTime: Date;

  @UpdateDateColumn({ select: false })
  updatedTime: Date;

  @OneToOne(() => User, user => user.id)
  createdBy: User;

}