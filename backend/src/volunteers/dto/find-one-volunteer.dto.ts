import { VolunteerInitial } from '../entities/volunteer.entity';
import { DepartmentLabel } from '../entities/department.entity';
import { UserStatus } from 'src/users/entities/user.entity';

export class FindOneVolunteerDto {
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
  status: UserStatus;
  departments: VolunteerToDepartment[];
}

export class VolunteerToDepartment {
  label: DepartmentLabel;
  trainingStatus: number;
  isTrainingRequired: boolean;
}
