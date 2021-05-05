import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { TextEncodingEnum } from './text-encoding.enum';
import { MailSendDto } from './mail.dto';
import { coerceArray } from 'st-utils';

@Entity()
export class MailQueue extends BaseEntity {
  @Column()
  template!: string;

  @Column({ type: 'json' })
  context!: Record<any, any>;

  @Column()
  from!: string;

  @Column({ type: 'array' })
  to!: string[];

  @Column({ type: 'array', nullable: true })
  cc?: string[];

  @Column({ type: 'array', nullable: true })
  bcc?: string[];

  @Column({ nullable: true })
  replyTo?: string;

  @Column({ nullable: true })
  inReplyTo?: string;

  @Column({ nullable: true })
  subject?: string;

  @Column({ nullable: true })
  text?: string;

  @Column({ nullable: true })
  html?: string;

  @Column({ nullable: true })
  sender?: string;

  @Column({ nullable: true })
  raw?: string;

  @Column({ nullable: true, type: 'enum', enum: TextEncodingEnum })
  textEncoding?: TextEncodingEnum;

  @Column({ nullable: true })
  references?: string;

  @Column({ nullable: true })
  encoding?: string;

  @Column({ nullable: true })
  date?: Date;

  @Column({ nullable: true })
  transporterName?: string;

  normalizeDto(dto: MailSendDto): this {
    if (dto.to) {
      dto.to = coerceArray(dto.to);
    }
    if (dto.cc) {
      dto.cc = coerceArray(dto.cc);
    }
    if (dto.bcc) {
      dto.bcc = coerceArray(dto.bcc);
    }
    Object.assign(this, dto);
    return this;
  }
}
