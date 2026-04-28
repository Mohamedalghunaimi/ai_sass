/* eslint-disable prettier/prettier */
import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { GetUserFromAt } from 'src/auth/decorators/get-user-from-at/get-user-from-at.decorator';
import { AtGuard } from 'src/auth/guards/at-guard/at-guard.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(AtGuard)
export class NotificationsController {
    constructor(private readonly NotificationService:NotificationsService){}

    @Get("")
    public async getAll(
        @GetUserFromAt("id") userId:string
    ) {
        const result = await this.NotificationService.getAllNotifications(userId);
        return result

    }

    @Delete(":id")
    public deleteOne(
        @Param("id") id:string,
        @GetUserFromAt("id") userId:string
    ) {
        return this.NotificationService.deleteNotification(userId,id)

    }


}
