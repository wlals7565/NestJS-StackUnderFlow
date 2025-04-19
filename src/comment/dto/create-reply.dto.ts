import { IsString, IsUUID, Length } from "class-validator";

export class CreateReplyDto {
  @IsString()
  @Length(1, 500)
  body: string;

  @IsString()
  @IsUUID()
  to: string;

  @IsString()
  @IsUUID()
  postId: string;

}
