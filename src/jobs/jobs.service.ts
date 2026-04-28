/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class JobsService { 

  constructor(
    private readonly prisma :PrismaService,
    private readonly aiService:AiService
  ){}
  async create(createJobDto: CreateJobDto,userId:string) {
    const {type,input,chatId} = createJobDto ;

    const newJob = await this.prisma.job.create({
      data:{
        type,
        input,
        userId
      }
    })

    await this.aiService.addJob({jobId:newJob.id,userId,input,chatId})





  }

}
