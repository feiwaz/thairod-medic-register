import { type } from "os";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User'
}

@Entity()
export class User {

  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

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

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

  @ManyToOne(type => User, user => user.id)
  createdBy: User;

}