/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { OnWorkerEvent, Processor, QueueEventsHost, WorkerHost } from '@nestjs/bullmq';
import { Job, QueueEvents } from 'bullmq';
import { ModelAiService } from 'src/model-ai/model-ai.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { NewJob } from 'utils/type';

@Processor('ai-job')
export class AiProcessor extends WorkerHost  {

    constructor(
        private readonly prisma:PrismaService,
        private readonly modelAiService:ModelAiService,
        private readonly redis:RedisService

    ) {
        super();
    }

    async process(job: Job<NewJob>, token?: string): Promise<any> {

        const {jobId,userId,input,chatId}  = job.data ;

        
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
            await this.redis.client.set(key,output,'EX', 60 * 60)
        }

    


        await this.prisma.$transaction(async(prisma)=> {


            await prisma.job.update({
                where:{id:jobId,userId},
                data:{
                    status:"DONE",
                    output
                }
            })
            await prisma.message.create({
                data: { content: output, role: 'AI', chatId: chatId }
            });        
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

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(`Processing job with id ${job.id}`);
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    console.log(`Job ${job.id} is in progress: % completed.`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job with id ${job.id} COMPLETED!`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    console.log(
      `Job with id ${job.id} FAILED! Attempt Number ${job.attemptsMade}`,
    );
  }
}