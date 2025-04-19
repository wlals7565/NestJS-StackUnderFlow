import { IsString, IsUUID, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @Length(1, 600)
  body: string;

  @IsString()
  @IsUUID()
  to: string;
}
