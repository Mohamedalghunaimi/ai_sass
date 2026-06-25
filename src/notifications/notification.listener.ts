/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// notification.listener.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { NotificationPayload } from './notification.types';
import { RedisService } from 'src/redis/redis.service';
import { NotificationsService } from './notifications.service';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class NotificationListener implements OnModuleInit {

  constructor(
    private readonly redis: RedisService,
    private readonly notificationService:NotificationsService,
    private readonly logger:LoggerService
  ) {}

  async onModuleInit() {
    await this.redis.sub.subscribe('notifications');

    this.redis.sub.on('message',async (_, message) => {
        try {
        const data= JSON.parse(message) as NotificationPayload;
        if(!data.jobId || !data.output || !data.userId) {
          throw new Error("Invalid payload")
        }
        await this.notificationService.createNotification(data);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(message);
        }
        finally {
            this.redis.sub.disconnect();

        }



    });
  }
  async onModuleDestroy(){
  
    await this.redis.sub.unsubscribe(
      'notifications'
    );

    this.redis.sub.disconnect();

  }
}