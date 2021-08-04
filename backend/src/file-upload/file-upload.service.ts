import { Injectable } from '@nestjs/common';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/minio-client/file.model';

@Injectable()
export class FileUploadService {
  constructor(
    private minioClientService: MinioClientService
  ) {}

  async uploadSingle(image: BufferedFile) {
    const uploaded_image = await this.minioClientService.upload(image,"test_folder","new_name")

    return {
      image_url: uploaded_image.url,
      message: "Successfully uploaded to MinIO S3"
    }
  }

  async uploadMany(files: BufferedFile) {

    const image1 = files['image1'][0]
    const uploaded_image1 = await this.minioClientService.upload(image1,"test_folder","new_name")

    const image2 = files['image2'][0]
    const uploaded_image2 = await this.minioClientService.upload(image2,"test_folder","new_name")

    return {
      image1_url: uploaded_image1.url,
      image2_url: uploaded_image2.url,
      message: 'Successfully uploaded mutiple image on MinioS3'
    }
  }
}