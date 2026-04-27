/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// notification.listener.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { NotificationPayload } from './notification.types';
import { RedisService } from 'src/redis/redis.service';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationListener implements OnModuleInit {

  constructor(
    private readonly redis: RedisService,
    private readonly notificationService:NotificationsService
  ) {}

  async onModuleInit() {
    await this.redis.sub.subscribe('notifications');

    this.redis.sub.on('message',async (_, message) => {
        try {
        const data: NotificationPayload = JSON.parse(message);
        await this.notificationService.createNotification(data);
        } catch (error) {
            console.error(error)
        }


    });
    }
}