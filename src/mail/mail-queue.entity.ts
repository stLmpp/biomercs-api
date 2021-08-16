import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../shared/super/base-entity';
import { TextEncodingEnum } from './text-encoding.enum';
import { MailSendDto } from './mail.dto';
import { coerceArray } from 'st-utils';
import { Property } from '../mapper/property.decorator';
import { SchemaEnum } from '../environment/schema.enum';

@Entity({ schema: SchemaEnum.main })
export class MailQueue extends BaseEntity {
  @Property()
  @Column()
  template!: string;

  @Property()
  @Column({ type: 'json' })
  context!: Record<any, any>;

  @Property()
  @Column()
  from!: string;

  @Property()
  @Column({ array: true, type: 'character varying' })
  to!: string[];

  @Property()
  @Column({ array: true, type: 'character varying', nullable: true })
  cc?: string[];

  @Property()
  @Column({ array: true, type: 'character varying', nullable: true })
  bcc?: string[];

  @Property()
  @Column({ nullable: true })
  replyTo?: string;

  @Property()
  @Column({ nullable: true })
  inReplyTo?: string;

  @Property()
  @Column({ nullable: true })
  subject?: string;

  @Property()
  @Column({ nullable: true })
  text?: string;

  @Property()
  @Column({ nullable: true })
  html?: string;

  @Property()
  @Column({ nullable: true })
  sender?: string;

  @Property()
  @Column({ nullable: true })
  raw?: string;

  @Property()
  @Column({ nullable: true, type: 'enum', enum: TextEncodingEnum })
  textEncoding?: TextEncodingEnum;

  @Property()
  @Column({ nullable: true })
  references?: string;

  @Property()
  @Column({ nullable: true })
  encoding?: string;

  @Property()
  @Column({ nullable: true })
  date?: Date;

  @Property()
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
