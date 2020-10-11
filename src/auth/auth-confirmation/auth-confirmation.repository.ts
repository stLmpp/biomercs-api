import { EntityRepository, Repository } from 'typeorm';
import { AuthConfirmation } from './auth-confirmation.entity';

@EntityRepository(AuthConfirmation)
export class AuthConfirmationRepository extends Repository<AuthConfirmation> {}
