import { PartialType } from '@nestjs/mapped-types';
import { CreateReplyDto } from '../../comment/dto/create-reply.dto';

export class UpdateReplyDto extends PartialType(CreateReplyDto) {}
