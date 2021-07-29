import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {

  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column()
  initial: string;

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

  @Column({ default: 'pending' })
  status: string;

}