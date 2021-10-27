import { Injectable } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Environment } from '../environment/environment';
import { FileType } from './file.type';

export interface FileUploadOptions {
  path?: string;
  name?: string;
}

@Injectable()
export class FileUploadService {
  constructor(private environment: Environment) {}

  private readonly _s3Client = new S3Client({
    region: this.environment.get('AWS_REGION'),
    apiVersion: this.environment.get('AWS_S3_API_VERSION'),
    credentials: {
      accessKeyId: this.environment.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.environment.get('AWS_SECRET_ACCESS_KEY'),
    },
  });

  async send(file: FileType, options: FileUploadOptions = {}): Promise<void> {
    const { name = file.originalname, path = '' } = options;
    await this._s3Client.send(
      new PutObjectCommand({
        Bucket: this.environment.get('AWS_S3_BUCKET'),
        Key: path + name,
        Body: file.buffer,
      })
    );
  }

  async delete(path: string): Promise<void> {
    await this._s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.environment.get('AWS_S3_BUCKET'),
        Key: path,
      })
    );
  }
}
