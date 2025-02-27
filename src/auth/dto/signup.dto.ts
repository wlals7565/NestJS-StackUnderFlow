import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class SignupDto {
  @IsString()
  @Length(2, 50)
  @Matches(/^[A-Za-z0-9]+$/, {
    message:
      'Name can only contain uppercase letters, lowercase letters, and numbers.',
  })
  name: string;

  @IsEmail()
  @Length(3, 254)
  email: string;

  @IsString()
  @Length(8, 64)
  @Matches(/^(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,64}$/, {
    message:
      'Password must include at least one number and one special character.',
  })
  password: string;

  @IsString()
  @Length(8, 64)
  passwordConfirm: string;
}
