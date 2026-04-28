/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AtGuard } from 'src/auth/guards/at-guard/at-guard.guard';
import { GetUserFromAt } from 'src/auth/decorators/get-user-from-at/get-user-from-at.decorator';


@Controller('chats')
@UseGuards(AtGuard)

export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(
    @GetUserFromAt("id") id:string
  ) {
    return this.chatService.create(id);
  }

  @Get()
  findAll(
    @GetUserFromAt("id") id:string
  ) {
    return this.chatService.findAll(id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @GetUserFromAt("id") userId:string
  ) {
    return this.chatService.findOne(id,userId);
  }


  @Delete(':id')
  remove(
    @Param('id') id: string,
    @GetUserFromAt("id") userId:string

  ) {
    return this.chatService.remove(id,userId);
  }
}
