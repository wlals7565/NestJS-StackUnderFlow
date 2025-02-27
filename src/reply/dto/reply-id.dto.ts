import { IsUUID } from 'class-validator';

export class ReplyIdDto {
  @IsUUID()
  replyId: string;
}
