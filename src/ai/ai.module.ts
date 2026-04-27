/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { BullModule } from '@nestjs/bullmq';
import { AiProcessor } from './ai.processor';
@Global()
@Module({
  imports:[
    BullModule.registerQueue({
      name: 'ai-job',
      defaultJobOptions: {
        attempts: 3, // retries
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
  ],
  providers: [AiService,AiProcessor],
  exports:[AiService]

})
export class AiModule {}
