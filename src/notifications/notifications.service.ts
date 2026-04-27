/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationPayload } from './notification.types';

@Injectable()
export class NotificationsService {

    constructor(
        private readonly gateway: NotificationGateway,
        private readonly prisma: PrismaService
    ){}

    public async createNotification(data:NotificationPayload) {
        const notification = await this.prisma.notification.create({
            data:{
                userId:data.userId,
                isRead:false,
                message:`job with id => ${data.jobId} is created`


            }
        })
        this.gateway.sendToUser(data.userId, notification);

    }

}
