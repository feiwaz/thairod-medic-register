import { VerificationStatus } from "src/enum/verification-status.enum";

export class VerificationResponseDto {
  status: VerificationStatus;
  statusNote: string;
  updatedTime: Date;
  verifiedBy: {
    firstName: string;
    lastName: string;
    contactNumber: string;
  }
}