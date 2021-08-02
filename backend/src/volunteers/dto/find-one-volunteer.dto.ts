import {
  VolunteerInitial,
  VolunteerStatus,
} from '../entities/volunteer.entity';
import { DepartmentLabel } from '../entities/department.entity';

export class FindOneVolunteerDto {
  id: string;
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
  status: VolunteerStatus;
  departments: VolunteerToDepartment[];
}

export class VolunteerToDepartment {
  label: DepartmentLabel;
  trainingStatus: number;
  isTrainingRequired: boolean;
}
