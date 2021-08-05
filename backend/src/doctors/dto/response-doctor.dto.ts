import { UserStatus } from 'src/users/entities/user.entity';
import { DoctorInitial } from '../entities/doctor.entity';
import { SpecializedFieldLabel } from '../entities/specializedField.entity';

export class responseDoctorDto {
  id: number;
  nationalId: string;
  initial: DoctorInitial;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  contactNumber: string;
  lineId: string;
  medCertificateId: number;
  jobCertificateImg: string;
  jobCertificateSelfieImg: string;
  idCardImg: string;
  idCardSelfieImg: string;
  status: UserStatus;
  specializedFields: SpecializedFieldLabel[];
}
