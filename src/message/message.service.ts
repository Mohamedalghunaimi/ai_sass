/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobsService } from 'src/jobs/jobs.service';
import { RedisService } from 'src/redis/redis.service';
import { Message } from '@prisma/client';

@Injectable()
export class MessageService {

  constructor(
    private readonly prisma:PrismaService,
    private readonly jobService:JobsService,
    private readonly redis:RedisService
    

    
  ){}
  public async create(
    createMessageDto: CreateMessageDto,
    chatId:string,
    userId:string
  ) {
    const {content} = createMessageDto

    const existingChat = await this.prisma.chat.findFirst({
      where:{
        userId,
        id:chatId
      }
    })

    if(!existingChat) {
      throw new NotFoundException("chat not found")
    }
    await this.redis.client.del(`chat-${existingChat.id}-messages`)

    const newMessage = await this.prisma.message.create({
      data:{
        content,
        role:"USER",
        chatId
      }
    })

    await this.jobService.create(
      {type:"AI_GENERATION",input:content,chatId},
      userId
    )

    return {
      newMessage

    }


  


  }

  async findAll(
    chatId:string,
    userId:string
  ) {
    const existingChat = await this.prisma.chat.findFirst({
      where:{id:chatId,userId}
    });
    if(!existingChat) {
      throw new NotFoundException("chat not found")
    }
    const cached = await this.redis.client.get(`chat-${existingChat.id}-messages`)
    if(cached) {
      return {
        messages: JSON.parse(cached) as Message[]
      }
    } 
    const messages = await this.prisma.message.findMany({
      where:{
        chatId:existingChat.id
      },
      orderBy:{
        createdAt:"asc"
      }
    })
    await this.redis.client.set(`chatId-${existingChat.id}-messages`,JSON.stringify(messages),'EX',60*60);
    return {
      messages
    }

  }




}
