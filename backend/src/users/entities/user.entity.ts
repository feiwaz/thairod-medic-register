import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {

  @PrimaryColumn()
  id: number;

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

}