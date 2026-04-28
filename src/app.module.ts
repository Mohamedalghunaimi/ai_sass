/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JobsModule } from './jobs/jobs.module';
import { BullModule } from '@nestjs/bullmq';
import { AiModule } from './ai/ai.module';
import { ModelAiModule } from './model-ai/model-ai.module';
import { RedisModule } from './redis/redis.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    AuthModule, 
    PrismaModule,
    JwtModule.register({
      global:true,
      
    }),
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:".env"
    }),
    JobsModule,
    BullModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService) => {
        return {
          connection:{
              host: config.get<string>("REDIS_HOST"),
              port: Number(config.get<number>("REDIS_PORT")),
              maxRetriesPerRequest: null,
          }
        }

      }

    }),
    AiModule,
    ModelAiModule,
    RedisModule,
    NotificationsModule,
    ChatModule,
    MessageModule,
    LoggerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
