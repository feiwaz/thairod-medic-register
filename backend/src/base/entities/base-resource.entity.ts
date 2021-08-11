import { PrimaryGeneratedColumn } from "typeorm";

export abstract class BaseResource {

  @PrimaryGeneratedColumn()
  id: number;

}
