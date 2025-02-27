import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @Length(3, 254)
  email: string;

  @IsString()
  @Length(8, 64)
  password: string;
}
