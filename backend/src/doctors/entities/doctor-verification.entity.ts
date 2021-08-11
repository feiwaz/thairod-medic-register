import { BaseVerification } from "src/base/entities/base-verification.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, ManyToOne } from "typeorm";
import { Doctor } from "./doctor.entity";

@Entity()
export class DoctorVerification extends BaseVerification {

  @ManyToOne(
    () => Doctor, doctor => doctor.doctorVerifications,
    { cascade: true }
  )
  doctor: Doctor;

  @ManyToOne(() => User, verifiedBy => verifiedBy.doctorVerifications)
  verifiedBy: User;

}
