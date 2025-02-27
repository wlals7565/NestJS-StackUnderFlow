import { IsString, Length } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @Length(1, 20000)
  body: string;
}
