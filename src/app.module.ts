import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './ormconfig';
import { ProfileModule } from './profile/profile.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { ReplyModule } from './reply/reply.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { AnswerModule } from './answer/answer.module';
import { SlackService } from './slack/slack.service';
import { APP_FILTER } from '@nestjs/core';
import { SlackExceptionFilter } from './common/filters/slack-exception.filter';
import { ImagesModule } from './images/images.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ProfileModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(ormConfig),
    PostModule,
    CommentModule,
    ReplyModule,
    RecommendationModule,
    AnswerModule,
    ProfileModule,
    ImagesModule,
    UserModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SlackService,
    {
      provide: APP_FILTER,
      useClass: SlackExceptionFilter,
    },
  ],
})
export class AppModule {}
