import { Column, CreateDateColumn, DeepPartial, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Property } from '../../mapper/property.decorator';

export abstract class BaseEntityNoId {
  @Property()
  @ApiHideProperty()
  @CreateDateColumn()
  creationDate!: Date;

  @Property()
  @ApiHideProperty()
  @UpdateDateColumn({ nullable: true })
  lastUpdatedDate?: Date;

  @Property()
  @ApiHideProperty()
  @Column()
  createdBy!: number;

  @Property()
  @ApiHideProperty()
  @Column({ nullable: true })
  lastUpdatedBy?: number;

  extendDto(dto: DeepPartial<this>): this {
    Object.assign(this, dto);
    return this;
  }
}

export abstract class BaseEntity extends BaseEntityNoId {
  @Property()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;
}
