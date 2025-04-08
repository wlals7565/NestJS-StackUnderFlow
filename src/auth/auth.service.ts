import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AvatarService } from 'src/avatar/avatar.service';
import { plainToInstance } from 'class-transformer';
import { Profile } from 'src/profile/entities/profile.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
    private readonly jwtService: JwtService,
    private readonly avatarService: AvatarService,
  ) {}
  // 로그인
  async login(loginDto: LoginDto) {
    // 해당 아이디를 가진 유저 확인
    const existUser = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
    if (!existUser) {
      throw new BadRequestException(`no user with email: ${loginDto.email}`);
    }
    // 해당 아이디의 비밀번호 확인
    const isPasswordMatched = await bcrypt.compare(
      loginDto.password,
      existUser.password,
    );
    if (!isPasswordMatched) {
      throw new BadRequestException('the password is wrong');
    }
    // JWT 토큰 만들어서 주기
    const accessToken = await this.jwtService.signAsync({
      name: existUser.name,
      email: existUser.email,
      uuid: existUser.id,
    });
    return {
      accessToken,
      message: 'login sucessful!',
      name: existUser.name,
      email: existUser.email,
      uuid: existUser.id,
      image: existUser.image,
    };
  }

  // 회웝 가입
  async signup(signupDto: SignupDto) {
    const { email, name } = signupDto;

    // 이메일 중복 검사
    const existUserByEmail = await this.userRepository.findOne({
      where: { email },
    });

    if (existUserByEmail) {
      throw new ConflictException('This email is already in use.');
    }
    // 이름 중복 검사
    const existUserByName = await this.userRepository.findOne({
      where: { name },
    });

    if (existUserByName) {
      throw new ConflictException('This name is already in use.');
    }
    // 비밀번호 해싱
    const hash = await bcrypt.hash(signupDto.password, 10);
    signupDto = { ...signupDto, password: hash };
    // 새로운 유저 생성 및 저장
    const picturePath = await this.avatarService.downloadGravatar(
      signupDto.email,
      signupDto.name,
    );
    const newUser = this.userRepository.create({
      ...signupDto,
      image: picturePath,
    });
    await this.userRepository.save(newUser);
    await this.profileRepository.save({
      user: {id: newUser.id},
      aboutMe: "자기소개를 입력해주세요."
    })
    return { message: 'Signup successful!' };
  }

  async checkJWT(accessToken: string) {
    const result = this.jwtService.verify(accessToken);
    return result;
  }

  // JWT토큰을 통한 유저 정보 가져오기
  async getUserInfo(userId: string) {
    const userInfo = await this.userRepository.findOne({
      where: { id: userId },
    });
    return plainToInstance(User, userInfo);
  }
}
