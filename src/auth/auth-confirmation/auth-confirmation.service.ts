import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthConfirmationRepository } from './auth-confirmation.repository';
import { AuthConfirmationAddDto } from './auth-confirmation.dto';
import { AuthConfirmation } from './auth-confirmation.entity';
import { FindConditions, MoreThanOrEqual } from 'typeorm';
import { isBefore } from 'date-fns';
import { updateCreatedBy } from '../created-by.pipe';

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
    return this.authConfirmationRepository.save(new AuthConfirmation().extendDto(updateCreatedBy(dto, dto.idUser)));
  }

  async invalidateCode(idUser: number, code: number): Promise<void> {
    await this.authConfirmationRepository.update(
      { idUser, code, lastUpdatedBy: idUser },
      { expirationDate: new Date() }
    );
  }

  async invalidateLastCode(idUser: number): Promise<void> {
    const authConfirmation = await this.getByIdUser(idUser);
    if (authConfirmation) {
      await this.invalidateCode(idUser, authConfirmation.code);
    }
  }

  async confirmCode(idUser: number, code: number): Promise<void> {
    const authConfirmation = await this.authConfirmationRepository.findOne({ where: { idUser, code } });
    if (!authConfirmation) {
      throw new NotFoundException('Confirmation code not found');
    }
    if (isBefore(authConfirmation.expirationDate, new Date())) {
      throw new ForbiddenException('Confirmation code is expired');
    }
    await this.invalidateCode(idUser, code);
  }

  async exists(idUser: number, code?: number): Promise<boolean> {
    const options: FindConditions<AuthConfirmation> = { idUser, expirationDate: MoreThanOrEqual(new Date()) };
    if (code) {
      options.code = code;
    }
    return await this.authConfirmationRepository.exists(options);
  }

  async getByIdUser(idUser: number): Promise<AuthConfirmation | undefined> {
    return this.authConfirmationRepository.findOne({ where: { idUser, expirationDate: MoreThanOrEqual(new Date()) } });
  }
}
