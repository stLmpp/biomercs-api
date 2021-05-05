import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailInfoTemplate } from './mail-info.interface';
import { environment } from '../environment/environment';
import { MailQueueRepository } from './mail-queue.repository';
import { Subject } from 'rxjs';
import { auditTime, filter, switchMap } from 'rxjs/operators';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { MailQueue } from './mail-queue.entity';
import { MailPriorityEnum } from './mail-priority.enum';
import { MailSendDto } from './mail.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private mailQueueRepository: MailQueueRepository) {
    this._init().then();
  }

  private _mailQueue$ = new Subject<void>();

  @Transactional()
  private async _sendMails(mailQueues: MailQueue[]): Promise<void> {
    const promises = mailQueues.map(mailQueue => this._sendMail(mailQueue));
    await Promise.all(promises);
  }

  private async _sendMail(mailQueue: MailQueue): Promise<void> {
    await this.mailerService.sendMail(mailQueue);
  }

  private async _init(): Promise<void> {
    this._mailQueue$
      .pipe(
        auditTime(900000), // TODO environment variable?
        switchMap(() => this.mailQueueRepository.find()),
        filter(mailQueues => !!mailQueues.length)
      )
      .subscribe(async mailQueues => {
        await this._sendMails(mailQueues);
      });
    const queueExists = await this.mailQueueRepository.exists();
    if (queueExists) {
      this._mailQueue$.next();
    }
  }

  async sendMailInfo(
    options: Omit<MailSendDto, 'template' | 'from' | 'context'>,
    mailInfoTemplate: MailInfoTemplate,
    priority?: MailPriorityEnum
  ): Promise<void> {
    switch (priority) {
      case MailPriorityEnum.now: {
        await this.mailerService.sendMail({
          ...options,
          from: environment.get('MAIL'),
          template: 'info',
          context: {
            title: mailInfoTemplate.title,
            version: environment.appVersion,
            year: new Date().getFullYear(),
            info: mailInfoTemplate.info,
          },
        });
        break;
      }
      default: {
        await this.mailQueueRepository.save(
          new MailQueue().normalizeDto({
            ...options,
            template: 'info',
            from: environment.get('MAIL'),
            context: {
              title: mailInfoTemplate.title,
              version: environment.appVersion,
              year: new Date().getFullYear(),
              info: mailInfoTemplate.info,
            },
          })
        );
        this._mailQueue$.next();
      }
    }
  }
}
