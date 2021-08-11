import { VerificationStatus } from 'src/enum/verification-status.enum';
import { DoctorInitial } from '../entities/doctor.entity';
import { SpecializedFieldLabel } from '../entities/specialized-field.entity';

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
  status: VerificationStatus;
  specializedFields: SpecializedFieldLabel[];
  verification: any;
}
