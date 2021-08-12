import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { MinioService } from 'nestjs-minio-client';
import { Stream } from 'stream';
import { BufferedFile } from './file.model';

@Injectable()
export class MinioClientService {

  public get minioClient() {
    return this.minioService.client;
  }

  constructor(private readonly minioService: MinioService) { }

  public async uploadBufferedFile(bufferedFile: BufferedFile, folderSuffix: string, nationalId: string): Promise<any> {
    const { idCard, idCardSelfie, medCertificate, medCertificateSelfie } = bufferedFile as any;
    const idCardUrl = await this.upload(idCard[0] || null, `${nationalId}_${folderSuffix}`);
    const idCardSelUrl = await this.upload(idCardSelfie[0] || null, `${nationalId}_${folderSuffix}`);
    const jobCerUrl = medCertificate ? await this.upload(medCertificate[0] || null, `${nationalId}_${folderSuffix}`) : null;
    const jobCerSelUrl = medCertificateSelfie ? await this.upload(medCertificateSelfie[0] || null, `${nationalId}_${folderSuffix}`) : null;
    return { idCardUrl, idCardSelUrl, jobCerUrl, jobCerSelUrl };
  }

  public async upload(file: BufferedFile, folder: string): Promise<string> {
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      throw new BadRequestException('อนุญาตให้อัพโหลดเฉพาะรูปภาพเท่านั้น');
    }

    const dateString = Date.now().toString()
    const hashedFileName = createHash('md5').update(dateString).digest('hex');
    const fileExtension = file.mimetype.substring(6, file.mimetype.length);
    let fileName = `${folder}/${hashedFileName}.${fileExtension}`;
    try {
      await this.minioClient.putObject(process.env.MINIO_BUCKET_NAME, fileName, file.buffer);
    } catch (error) {
      fileName = null;
      console.warn(`Failed to upload file: ${fileName}, due to error: ${error}`);
      throw new BadGatewayException(`Failed to upload file: ${fileName}`);
    }
    return fileName;
  }

  public async get(objectName: string): Promise<Stream> {
    let stream: Stream;
    try {
      stream = await this.minioClient.getObject(process.env.MINIO_BUCKET_NAME, objectName);
    } catch (error) {
      console.warn(`Failed to get object: ${objectName}, due to error: ${error}`);
      throw new BadGatewayException(`Failed to get object: ${objectName}`);
    }
    return stream;
  }

  async delete(objetName: string) {
    this.minioClient.removeObject(process.env.MINIO_BUCKET_NAME, objetName)
  }

}