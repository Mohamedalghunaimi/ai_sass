/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationListener } from './notification.listener';
import { NotificationsController } from './notifications.controller';

@Module({
  providers: [
    NotificationsService,
    NotificationGateway,
    NotificationListener,
  ],
  exports:[NotificationsService],
  controllers: [NotificationsController]
})
export class NotificationsModule {}
