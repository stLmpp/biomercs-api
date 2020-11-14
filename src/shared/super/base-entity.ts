import { Column, CreateDateColumn, DeepPartial, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiHideProperty()
  @CreateDateColumn()
  creationDate!: Date;

  @ApiHideProperty()
  @UpdateDateColumn({ nullable: true })
  lastUpdatedDate?: Date;

  @ApiHideProperty()
  @Column()
  createdBy!: number;

  @ApiHideProperty()
  @Column({ nullable: true })
  lastUpdatedBy?: number;

  extendDto(dto: DeepPartial<this>): this {
    Object.assign(this, dto);
    return this;
  }
}
