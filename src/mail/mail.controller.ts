import { Controller, Get, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/api-auth.decorator';
import { ApiAdmin } from '../auth/api-admin.decorator';
import { MailService } from './mail.service';
import { MailStatusQueueViewModel } from './mail.view-model';

@ApiAuth()
@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @ApiAdmin()
  @Get('status-queue')
  statusQueue(): MailStatusQueueViewModel {
    return this.mailService.statusQueue();
  }

  @ApiAdmin()
  @Put('restart-queue')
  async restartQueue(): Promise<MailStatusQueueViewModel> {
    return await this.mailService.restartQueue();
  }
}
