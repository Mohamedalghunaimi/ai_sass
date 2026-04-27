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
import { RedisService } from 'src/redis/redis.service';

@Processor('ai-job')
export class AiProcessor extends WorkerHost {

    constructor(
        private readonly prisma:PrismaService,
        private readonly modelAiService:ModelAiService,
        private readonly redis:RedisService

    ) {
        super();
    }
    
    async process(job: Job<{jobId:string,userId:string,input:string}>, token?: string): Promise<any> {

        const {jobId,userId,input}  = job.data ;

        
        try {
        await this.prisma.job.update({
            where:{id:jobId,userId},
            data:{
                status:"PROCESSING"
            }
        })
        const key = `ai-${input}`;

        const cached = await this.redis.client.get(key);
        let output :string ;
        if(cached) {
            output = cached
        } else {
            output = await this.modelAiService.generateText(input) as string;
            await this.redis.client.set(key,output)
        }

    

        await this.prisma.job.update({
            where:{id:jobId,userId},
            data:{
                status:"DONE",
                output
            }
        })
        await this.redis.pub.publish(
            'notifications',
            JSON.stringify({
            userId,
            jobId,
            status: 'DONE',
            output,
            }),
        );

        } catch (error) {

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