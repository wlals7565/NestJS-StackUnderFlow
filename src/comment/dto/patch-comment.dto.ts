import { IsString, Length } from 'class-validator';

export class PatchCommentDto {
  @IsString()
  @Length(15, 600)
  body: string;
}
