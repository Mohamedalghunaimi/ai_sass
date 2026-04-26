/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
