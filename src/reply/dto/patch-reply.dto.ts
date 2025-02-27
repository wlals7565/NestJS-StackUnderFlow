import { IsString, Length } from 'class-validator';

export class PatchReplyDto {
  @IsString()
  @Length(15, 600)
  body: string;
}
