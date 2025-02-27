import { IsString, Length } from 'class-validator';

export class PatchAnswerDto {
  @IsString()
  @Length(1, 20000)
  body: string;
}
