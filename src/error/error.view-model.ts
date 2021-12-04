import { ErrorInterface } from './error.interface';
import { Property } from '../mapper/property.decorator';

export class ErrorViewModel implements ErrorInterface {
  @Property() id!: number;
  @Property() name!: string;
  @Property() message!: string;
  @Property() stack!: string;
  @Property() sqlCode?: string;
  @Property() sqlHint?: string;
  @Property() sqlParameters?: any[];
  @Property() sqlQuery?: string;
  @Property() sqlQueryWithParameters?: string;
  @Property() createdBy!: number;
  @Property() createdByUsername?: string;
  @Property() creationDate!: Date;
  @Property() url?: string;
  @Property() body?: any;
}
