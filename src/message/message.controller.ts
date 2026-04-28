/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body,  Param,  UseGuards} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AtGuard } from 'src/auth/guards/at-guard/at-guard.guard';
import { GetUserFromAt } from 'src/auth/decorators/get-user-from-at/get-user-from-at.decorator';

@Controller('messages')
@UseGuards(AtGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post(":chatId")
  create(
    @Body() createMessageDto: CreateMessageDto,
    @Param("chatId") chatId:string,
    @GetUserFromAt("id") userId:string

    
  ) {
    return this.messageService.create(createMessageDto,chatId,userId);
  }

  @Get(":chatId")
  findAll(
    @Param("chatId") chatId:string,
    @GetUserFromAt("id") userId:string

  ) {
    return this.messageService.findAll(chatId,userId);
  }



}
