import { Property } from '../mapper/property.decorator';

export class MailStatusQueueViewModel {
  @Property() maxRetries!: number;
  @Property() retryAttempts!: number;
  @Property() queueWorking!: boolean;
  @Property() status!: string;
}
