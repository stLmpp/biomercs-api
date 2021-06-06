import { QueryFailedError } from 'typeorm';

export class PostgresQueryError extends QueryFailedError {
  length!: number;
  severity!: string;
  code!: string;
  position!: string;
  file!: string;
  line!: string;
  routine!: string;
  // TODO missing properties
}
