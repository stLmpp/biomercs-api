import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailInfoTemplate } from './mail-info.interface';
import { environment } from '../environment/environment';
import { MailQueueRepository } from './mail-queue.repository';
import { auditTime, catchError, filter, of, Subject, switchMap } from 'rxjs';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { MailQueue } from './mail-queue.entity';
import { MailPriorityEnum } from './mail-priority.enum';
import { MailSendDto } from './mail.dto';
import { MailStatusQueueViewModel } from './mail.view-model';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private mailQueueRepository: MailQueueRepository) {
    this._init().then();
  }

  private _retryAttempts = 0;
  private _mailQueue$ = new Subject<void>();

  @Transactional()
  private async _sendMails(mailQueues: MailQueue[]): Promise<void> {
    const promises = mailQueues.map(mailQueue => this._sendMail(mailQueue));
    await Promise.all(promises);
  }

  private async _sendErrorSupport(error: any): Promise<void> {
    await this.sendMailInfo(
      {
        to: [environment.mail, environment.mailOwner],
        subject: 'Failed to send mail after 3 attempts, mail services stopped',
      },
      {
        title: 'Failed to send mail after 3 attempts, mail services stopped',
        info: [{ title: 'Error', value: JSON.stringify(error) }],
      },
      MailPriorityEnum.now
    );
  }

  private async _sendMail(mailQueue: MailQueue): Promise<void> {
    await Promise.all([this.mailerService.sendMail(mailQueue), this.mailQueueRepository.delete(mailQueue.id)]);
  }

  private async _init(): Promise<void> {
    this._mailQueue$
      .pipe(
        auditTime(environment.mailAuditTime),
        switchMap(() => this.mailQueueRepository.find()),
        filter(mailQueues => !!mailQueues.length),
        switchMap(mailQueues => this._sendMails(mailQueues)),
        catchError(err => {
          if (this._retryAttempts <= environment.mailQueueMaxRetries) {
            this._retryAttempts++;
            this._init();
          } else {
            this._sendErrorSupport(err);
          }
          return of(null);
        })
      )
      .subscribe();
    const queueExists = await this.mailQueueRepository.exists();
    if (queueExists) {
      this._mailQueue$.next();
    }
  }

  async restartQueue(): Promise<MailStatusQueueViewModel> {
    this._retryAttempts = 0;
    await this._init();
    return this.statusQueue();
  }

  statusQueue(): MailStatusQueueViewModel {
    const maxRetries = environment.mailQueueMaxRetries;
    const queueWorking = this._retryAttempts <= maxRetries;
    return {
      maxRetries,
      retryAttempts: this._retryAttempts,
      status: this._retryAttempts < maxRetries ? 'Working' : 'Stopped',
      queueWorking,
    };
  }

  async sendMailInfo(
    options: Omit<MailSendDto, 'template' | 'from' | 'context'>,
    mailInfoTemplate: MailInfoTemplate,
    priority?: MailPriorityEnum
  ): Promise<void> {
    const newOptions: MailSendDto = {
      ...options,
      template: './info.hbs',
      from: environment.mail,
      context: {
        title: mailInfoTemplate.title,
        version: environment.appVersion,
        year: new Date().getFullYear(),
        info: mailInfoTemplate.info,
      },
    };
    switch (priority) {
      case MailPriorityEnum.now: {
        await this.mailerService.sendMail(newOptions);
        break;
      }
      default: {
        await this.mailQueueRepository.save(new MailQueue().normalizeDto(newOptions));
        this._mailQueue$.next();
      }
    }
  }
}
