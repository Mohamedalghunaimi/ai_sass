/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ChatService {
  constructor(private readonly prisma:PrismaService) {}
  public async create(userId:string) {
    const newChat = await this.prisma.chat.create({
      data:{
        userId
      }
    })

    return newChat;


  }

  public async findAll(userId:string) {
    const chats = await this.prisma.chat.findMany({
      where:{userId}
    })

    return chats


  }

  public async findOne(id: string,userId:string) {
    const existingChat = await this.prisma.chat.findFirst({
      where:{
        id,
        userId

      }
    })

    if(!existingChat) {
      throw new NotFoundException("chat not found")
    }

    return existingChat
  }



  public async remove(id: string,userId:string) {

    return this.prisma.$transaction(async(prisma)=> {
    const existingChat = await prisma.chat.findFirst({
      where:{
        id,
        userId

      }
    })

    if(!existingChat) {
      throw new NotFoundException("chat not found")
    }

    await prisma.chat.delete({
      where:{
        id:existingChat.id
      }
    })

    return {
      message:"chat is deleted successfully!"
    }


    })

    
  }
}
