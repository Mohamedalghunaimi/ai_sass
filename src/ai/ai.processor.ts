/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { resolve } from 'path';
import { ModelAiService } from 'src/model-ai/model-ai.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Processor('ai-job')
export class AiProcessor extends WorkerHost {

    constructor(
        private readonly prisma:PrismaService,
        private readonly modelAiService:ModelAiService
    ) {
        super();
    }
    
    async process(job: Job, token?: string): Promise<any> {

        const {jobId,userId,input}  = job.data as {
            jobId:string,
            userId:string,
            input:string
        };
        try {
        await this.prisma.job.update({
            where:{id:jobId,userId},
            data:{
                status:"PROCESSING"
            }
        })
        const output = await this.modelAiService.generateText(input)
        await this.prisma.job.update({
            where:{id:jobId,userId},
            data:{
                status:"DONE",
                output
            }
        })

        } catch (error) {
            console.error(error)
            await this.prisma.job.update({
                where:{id:jobId,userId},
                data:{
                    status:"FAILED",
                }
            })        
            throw error;

        }
    }
  
}