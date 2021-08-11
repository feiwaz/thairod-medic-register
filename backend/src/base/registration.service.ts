import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Volunteer } from 'src/volunteers/entities/volunteer.entity';
import { Repository } from 'typeorm';

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

  public checkFileRequirement(bufferedFileKeys: string[], role: 'doctor' | 'volunteer') {
    const requiredFiles = role === 'doctor' ? this.doctorRequiredFiles : this.volunteerRequiredFiles;
    const pass = bufferedFileKeys.length !== 0 && requiredFiles.every(field => bufferedFileKeys.includes(field));
    if (!pass) {
      throw new BadRequestException(`${requiredFiles.join(', ')} are required`);
    }
  }

}