import { IsString, Length } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  @Length(15, 600)
  body: string;
}
