import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export function ApiFile(fileName = 'file', options?: MulterOptions): MethodDecorator {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fileName, options)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
  );
}
