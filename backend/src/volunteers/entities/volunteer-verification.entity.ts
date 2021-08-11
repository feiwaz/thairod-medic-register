import { BaseVerification } from "src/base/entities/base-verification.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, ManyToOne } from "typeorm";
import { Volunteer } from "./volunteer.entity";

@Entity()
export class VolunteerVerification extends BaseVerification {

  @ManyToOne(
    () => Volunteer, volunteer => volunteer.volunteerVerifications,
    { cascade: true }
  )
  volunteer: Volunteer;


  @ManyToOne(() => User, verifiedBy => verifiedBy.volunteerVerifications)
  verifiedBy: User;

}
