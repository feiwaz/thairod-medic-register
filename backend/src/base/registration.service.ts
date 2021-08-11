import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { DoctorVerification } from 'src/doctors/entities/doctor-verification.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { VerificationStatus } from 'src/enum/verification-status.enum';
import { VolunteerVerification } from 'src/volunteers/entities/volunteer-verification.entity';
import { Volunteer } from 'src/volunteers/entities/volunteer.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class RegistrationService {

  readonly doctorRequiredFiles = ['idCard', 'idCardSelfie', 'medCertificate', 'medCertificateSelfie'];
  readonly volunteerRequiredFiles = ['idCard', 'idCardSelfie'];

  public async checkIfNationalIdAlreadyExisted(repository: Repository<Doctor | Volunteer>, nationalId: string) {
    const entity = repository.findOne({ where: { nationalId } });
    if (entity) {
      throw new ConflictException('ผู้ใช้นี้ได้ลงทะเบียนแล้ว');
    }
  }

  public async checkStatus(
    nationalId: number,
    repository: Repository<Doctor | Volunteer>,
    verificationRepository: Repository<DoctorVerification | VolunteerVerification>,
    role: 'doctor' | 'volunteer'
  ): Promise<any> {
    const entity = await repository.findOne({
      select: ['id', 'status'],
      where: { nationalId }
    });
    if (!entity) {
      return {};
    }

    const options: FindOneOptions<DoctorVerification | VolunteerVerification> = {
      order: { updatedTime: 'DESC' }
    };
    options.where = role === 'doctor'
      ? { doctor: { id: entity.id } }
      : { volunteer: { id: entity.id } };
    const verification = await verificationRepository.findOne(options);
    const responseDto: any = { status: entity.status };
    if (entity.status !== VerificationStatus.PENDING && verification) {
      responseDto.statusNote = verification.statusNote;
      responseDto.updatedTime = verification.updatedTime;
    }
    return responseDto;
  }

  public checkFileRequirement(bufferedFileKeys: string[], role: 'doctor' | 'volunteer') {
    const requiredFiles = role === 'doctor' ? this.doctorRequiredFiles : this.volunteerRequiredFiles;
    const pass = bufferedFileKeys.length !== 0 && requiredFiles.every(field => bufferedFileKeys.includes(field));
    if (!pass) {
      throw new BadRequestException(`${requiredFiles.join(', ')} are required`);
    }
  }

}