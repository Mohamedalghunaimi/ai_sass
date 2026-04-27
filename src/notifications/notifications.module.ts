/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationListener } from './notification.listener';

@Module({
  providers: [
    NotificationsService,
    NotificationGateway,
    NotificationListener,
  ],
  exports:[NotificationsService]
})
export class NotificationsModule {}
