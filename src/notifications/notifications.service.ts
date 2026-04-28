/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationPayload } from './notification.types';
import { RedisService } from 'src/redis/redis.service';
import { Notification } from '@prisma/client';

@Injectable()
export class NotificationsService {

    constructor(
        private readonly gateway: NotificationGateway,
        private readonly prisma: PrismaService,
        private readonly redis:RedisService
    ){}

    public async createNotification(data:NotificationPayload) {
        try {
        const notification = await this.prisma.notification.create({
            data:{
                userId:data.userId,
                isRead:false,
                message:`job with id => ${data.jobId} is created`


            }
        })
        await this.redis.client.del(`notifications:${data.userId}`)
        this.gateway.sendToUser(data.userId, notification);
        } catch (error) {
            console.error(error)
        }
    }
    public async getAllNotifications(
        userId:string,

    ) {

        const cached = await this.redis.client.get(`notifications:${userId}`);
        if(cached) {
            return {
                notifications:JSON.parse(cached) as Notification[]

            }
        }

        const notifications = await this.prisma.notification.findMany({
            where:{userId}

        })
        await this.redis.client.set(`notifications:${userId}`,JSON.stringify(notifications),"EX",3600) 

        return {notifications}

    }

    public async deleteNotification(userId:string,id:string) {

        const notification = await this.prisma.notification.findFirst({
            where:{id,userId},
            select:{id:true}
        })
        if(!notification) {
            throw new NotFoundException("notification not found")
        }

        await this.prisma.notification.delete({
            where:{id:notification.id}
        })
        await this.redis.client.del(`notifications:${userId}`)

        return {
            message:"notification is deleted successfully"
        }



    }


    

}
