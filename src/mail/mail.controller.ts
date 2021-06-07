import { Controller, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/api-auth.decorator';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { MailService } from './mail.service';

@ApiAuth()
@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @ApiAdmin()
  @Put('restart-queue')
  async restartMailQueue(): Promise<void> {
    await this.mailService.restartMailQueue();
  }
}
