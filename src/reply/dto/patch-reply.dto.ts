import { IsString, Length } from 'class-validator';

export class PatchReplyDto {
  @IsString()
  @Length(1, 600)
  body: string;
}
