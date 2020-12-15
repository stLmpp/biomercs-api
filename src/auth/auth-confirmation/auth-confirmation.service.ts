import { BadRequestException, Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { AuthConfirmationRepository } from './auth-confirmation.repository';
import { AuthConfirmationAddDto } from './auth-confirmation.dto';
import { AuthConfirmation } from './auth-confirmation.entity';
import { FindConditions, MoreThanOrEqual } from 'typeorm';
import { addDays, addHours, isBefore } from 'date-fns';
import { random } from '../../util/util';

@Injectable()
export class AuthConfirmationService {
  constructor(private authConfirmationRepository: AuthConfirmationRepository) {}

  async add(dto: AuthConfirmationAddDto): Promise<AuthConfirmation> {
    const exists = await this.authConfirmationRepository.exists({
      idUser: dto.idUser,
      expirationDate: MoreThanOrEqual(new Date()),
    });
    if (exists) {
      throw new BadRequestException('User already waiting for confirmation!');
    }
    return this.authConfirmationRepository.save(new AuthConfirmation().extendDto(dto));
  }

  async invalidateCode(idUser: number, code: number): Promise<void> {
    await this.authConfirmationRepository.update({ idUser, code }, { expirationDate: addHours(new Date(), -1) });
  }

  async invalidateLastCode(idUser: number): Promise<void> {
    const authConfirmation = await this.getByIdUser(idUser);
    if (authConfirmation) {
      await this.invalidateCode(idUser, authConfirmation.code);
    }
  }

  async confirmCode(idUser: number, code: number): Promise<void> {
    const hasConfirmationCode = await this.hasConfirmationPending(idUser);
    if (!hasConfirmationCode) {
      throw new NotFoundException('User is not waiting for confirmation');
    }
    const authConfirmation = await this.authConfirmationRepository.findOne({ where: { idUser, code } });
    if (!authConfirmation) {
      throw new BadRequestException('Wrong code');
    }
    if (isBefore(authConfirmation.expirationDate, new Date())) {
      throw new BadRequestException('Confirmation code expired');
    }
    await this.invalidateCode(idUser, code);
  }

  async hasConfirmationPending(idUser: number, code?: number): Promise<boolean> {
    const options: FindConditions<AuthConfirmation> = { idUser, expirationDate: MoreThanOrEqual(new Date()) };
    if (code) {
      options.code = code;
    }
    return this.authConfirmationRepository.exists(options);
  }

  async generateConfirmationCode(idUser: number): Promise<number> {
    if (await this.hasConfirmationPending(idUser)) {
      throw new PreconditionFailedException({ message: 'User waiting for confirmation', extra: idUser });
    }
    const code = random(100000, 999999);
    await this.add({ idUser, code, expirationDate: addDays(new Date(), 1) });
    return code;
  }

  async getByIdUser(idUser: number): Promise<AuthConfirmation | undefined> {
    return this.authConfirmationRepository.findOne({ where: { idUser, expirationDate: MoreThanOrEqual(new Date()) } });
  }
}
