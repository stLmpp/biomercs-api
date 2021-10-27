import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

export const fileFilterImages: MulterOptions['fileFilter'] = (req, file, callback) => {
  const extensions = new Set(['jpg', 'jpeg', 'png']);
  const extension = extname(file.originalname).slice(1).toLowerCase();
  if (!extensions.has(extension)) {
    callback(new BadRequestException(`Wrong filetype. Allowed: ${[...extensions].join(', ')}`), false);
  }
  callback(null, true);
};
