/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports:[JobsModule]
})
export class MessageModule {}
