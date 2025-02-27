import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @Length(15, 600)
  body: string;
}
