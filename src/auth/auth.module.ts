import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/jwtconfig';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AvatarModule } from 'src/avatar/avatar.module';
import { Profile } from 'src/profile/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    JwtModule.registerAsync(jwtConfig),
    PassportModule,
    AvatarModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
