import { IsString, Length } from 'class-validator';

export class PatchCommentDto {
  @IsString()
  @Length(1, 600)
  body: string;
}
