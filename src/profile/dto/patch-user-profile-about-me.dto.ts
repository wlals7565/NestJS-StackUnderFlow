import { IsString, Length } from 'class-validator';

export class PatchUserProfileAboutMeDto {
  @IsString()
  @Length(1, 2000)
  aboutMe: string;
}
