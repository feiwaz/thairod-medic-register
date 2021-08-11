import { VerificationStatus } from 'src/enum/verification-status.enum';
import { DepartmentLabel } from '../entities/department.entity';
import { VolunteerInitial } from '../entities/volunteer.entity';

export class ResponseVolunteerDto {
  id: number;
  nationalId: string;
  initial: VolunteerInitial;
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
  departments: string[];
  verification: any;
}

export class VolunteerToDepartment {
  label: DepartmentLabel;
  trainingStatus: number;
  isTrainingRequired: boolean;
}
