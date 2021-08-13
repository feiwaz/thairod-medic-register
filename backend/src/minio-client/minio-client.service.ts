import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { ItemBucketMetadata } from 'minio';
import { MinioService } from 'nestjs-minio-client';
import { Stream } from 'stream';
import { BufferedFile } from './file.model';

@Injectable()
export class MinioClientService {

  public get minioClient() {
    return this.minioService.client;
  }

  constructor(private readonly minioService: MinioService) { }

  public async uploadBufferedFile(bufferedFile: BufferedFile, rolePrefix: string, nationalId: string): Promise<any> {
    const { idCard, idCardSelfie, medCertificate, medCertificateSelfie } = bufferedFile as any;
    const idCardUrl = idCard ? await this.upload(idCard[0] || null, rolePrefix, nationalId) : null;
    const idCardSelUrl = idCardSelfie ? await this.upload(idCardSelfie[0] || null, rolePrefix, nationalId) : null;
    const jobCerUrl = medCertificate ? await this.upload(medCertificate[0] || null, rolePrefix, nationalId) : null;
    const jobCerSelUrl = medCertificateSelfie ? await this.upload(medCertificateSelfie[0] || null, rolePrefix, nationalId) : null;
    return { idCardUrl, idCardSelUrl, jobCerUrl, jobCerSelUrl };
  }

  public async upload(file: BufferedFile, rolePrefix: string, nationalId: string): Promise<string> {
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      throw new BadRequestException('อนุญาตให้อัพโหลดเฉพาะรูปภาพเท่านั้น');
    }

    const dateString = Date.now().toString()
    const hashedFilename = createHash('md5').update(dateString).digest('hex');
    const objectName = `${rolePrefix}/${nationalId}/${hashedFilename}`;
    try {
      const metaData: ItemBucketMetadata = { 'Content-Type': file.mimetype };
      await this.minioClient.putObject(process.env.MINIO_BUCKET_NAME, objectName, file.buffer, metaData);
    } catch (error) {
      console.warn(`Failed to upload file: ${objectName}, due to error: ${error}`);
      throw new BadGatewayException(`Failed to upload file: ${objectName}`);
    }

    return `${rolePrefix}/${nationalId}/files/${hashedFilename}`;
  }

  public async get(objectName: string): Promise<Stream> {
    let stream: Stream;
    try {
      // const objectName = filename.split('/files/').join('/');
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