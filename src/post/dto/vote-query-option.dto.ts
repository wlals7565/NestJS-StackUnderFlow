import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty } from 'class-validator';

export class VoteQueryOption {
  @IsNotEmpty()
  @IsInt() // 숫자 타입을 검증
  @IsIn([-1, 1])
  @Transform(({ value }) => parseInt(value, 10))
  vote: number;
}
