import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { EnvironmentModule } from '../environment/environment.module';

@Module({
  imports: [EnvironmentModule],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
