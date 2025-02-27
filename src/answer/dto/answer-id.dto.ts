import { IsUUID } from 'class-validator';

export class AnswerIdDto {
  @IsUUID()
  answerId: string;
}
