import { VerificationStatus } from "src/enum/verification-status.enum";
import { VerificationResponseDto } from "./verification-response.dto";

export abstract class FindOneResponseDto {
  id: number;
  nationalId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  address: string;
  contactNumber: string;
  lineUserId: string;
  medCertificateId: number;
  jobCertificateImg: string;
  jobCertificateSelfieImg: string;
  idCardImg: string;
  idCardSelfieImg: string;
  status: VerificationStatus;
  verification: VerificationResponseDto;
}