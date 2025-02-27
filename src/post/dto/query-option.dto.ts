import { IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class QueryOptionDto {
  @IsNumberString()
  @IsOptional()
  limit?: number;

  @IsNumberString()
  @IsOptional()
  skip?: number;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  keyword?: string;
}
