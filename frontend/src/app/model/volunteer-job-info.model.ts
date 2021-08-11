export interface VolunteerJobInfo {
  departments: string[];
  idCard: File;
  idCardSelfie: File;
  medCertificateId?: number;
  medCertificate?: File;
  medCertificateSelfie?: File;
}
