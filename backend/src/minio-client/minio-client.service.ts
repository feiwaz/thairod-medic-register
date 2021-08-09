import { BadRequestException, Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.model';

@Injectable()
export class MinioClientService {

  public get minioClient() {
    return this.minioService.client;
  }

  constructor(private readonly minioService: MinioService) { }

  public async uploadBufferedFile(bufferedFile: BufferedFile, folderSuffix: string, nationalId: string): Promise<any> {
    const { idCard, idCardSelfie, medCertificate, medCertificateSelfie } = bufferedFile as any;
    const idCardUrl = await this.upload(idCard[0] || null,
      `${nationalId}_${folderSuffix}`, `${nationalId}_id_card`);
    const idCardSelUrl = await this.upload(idCardSelfie[0] || null,
      `${nationalId}_${folderSuffix}`, `${nationalId}_id_card_selfie`);
    const jobCerUrl = medCertificate ? await this.upload(medCertificate[0] || null,
      `${nationalId}_${folderSuffix}`, `${nationalId}_job_cer`) : null;
    const jobCerSelUrl = medCertificateSelfie ? await this.upload(medCertificateSelfie[0] || null,
      `${nationalId}_${folderSuffix}`, `${nationalId}_job_cer_selfie`) : null;
    return { idCardUrl, idCardSelUrl, jobCerUrl, jobCerSelUrl };
  }

  public async upload(file: BufferedFile, folder: string, newName: string): Promise<string> {
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      throw new BadRequestException('อนุญาตให้อัพโหลดเฉพาะรูปภาพเท่านั้น');
    }

    // const temp_filename = Date.now().toString()
    // const hashedFileName = crypto.createHash('md5').update(temp_filename).digest("hex");
    let url = null;
    const fileExtension = file.mimetype.substring(6, file.mimetype.length);
    const fileName = `${folder}/${newName}.${fileExtension}`;
    try {
      this.minioClient.putObject(process.env.MINIO_BUCKET_NAME, fileName, file.buffer, (error) => {
        if (error) throw new BadRequestException(`Failed to upload file: ${fileName}`);
      });
    } catch (error) {
      console.warn(error.message);
    }
    url = `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${fileName}`;
    return url;
  }

  async delete(objetName: string) {
    this.minioClient.removeObject(process.env.MINIO_BUCKET_NAME, objetName)
  }

}