import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { BucketItem, ItemBucketMetadata } from 'minio';
import { MinioService } from 'nestjs-minio-client';
import { Stream } from 'stream';
import { BufferedFile } from './file.model';

@Injectable()
export class MinioClientService {

  public get minioClient() {
    return this.minioService.client;
  }

  constructor(private readonly minioService: MinioService) { }

  public async uploadBufferedFile(bufferedFile: BufferedFile, objectPrefix: string): Promise<any> {
    const { idCard, idCardSelfie, medCertificate, medCertificateSelfie } = bufferedFile as any;
    const idCardUrl = idCard ? await this.upload(idCard[0] || null, objectPrefix) : null;
    const idCardSelUrl = idCardSelfie ? await this.upload(idCardSelfie[0] || null, objectPrefix) : null;
    const jobCerUrl = medCertificate ? await this.upload(medCertificate[0] || null, objectPrefix) : null;
    const jobCerSelUrl = medCertificateSelfie ? await this.upload(medCertificateSelfie[0] || null, objectPrefix) : null;
    return { idCardUrl, idCardSelUrl, jobCerUrl, jobCerSelUrl };
  }

  public async upload(file: BufferedFile, objectPrefix: string): Promise<string> {
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
      throw new BadRequestException('อนุญาตให้อัพโหลดเฉพาะรูปภาพเท่านั้น');
    }

    const dateString = Date.now().toString();
    const hashedFilename = createHash('md5').update(dateString).digest('hex');
    const objectName = `${objectPrefix}${hashedFilename}`;
    try {
      const metaData: ItemBucketMetadata = { 'Content-Type': file.mimetype };
      await this.minioClient.putObject(process.env.MINIO_BUCKET_NAME, objectName, file.buffer, metaData);
    } catch (error) {
      console.warn(`Failed to upload file: ${objectName}, due to error: ${error}`);
      throw new BadGatewayException(`Failed to upload file: ${objectName}`);
    }

    return `${objectPrefix}files/${hashedFilename}`;
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

  public async deleteAllFilesIfExist(objectPrefix: string): Promise<void> {
    const objectList = await this.getObjectList(objectPrefix);
    try {
      if (objectList.length > 0) {
        await this.minioClient.removeObjects(process.env.MINIO_BUCKET_NAME, objectList);
      } else {
        console.log(`No files found under: ${objectPrefix}`);
      }
    } catch (error) {
      console.log('Unable to remove objects');
    }
  }

  private getObjectList(prefix: string): Promise<string[]> {
    return new Promise(resolve => {
      const objectList = [];
      const stream = this.minioClient.listObjects(process.env.MINIO_BUCKET_NAME, prefix);
      stream.on('data', (object: BucketItem) => objectList.push(object.name));
      stream.on('error', error => console.warn(`Unable to list objects under: ${prefix}, due to error: ${error}`));
      stream.on('end', () => resolve(objectList));
    });
  }

}