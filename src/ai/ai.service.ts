/* eslint-disable prettier/prettier */
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Queue} from 'bullmq';

@Injectable()
export class AiService {

    constructor(
        @InjectQueue('ai-job') private readonly aiQueue: Queue,
    ) {}

    public async addJob(jobId:string,userId:string,input:string) {

        try {

            await this.aiQueue.add('newAiJob',{jobId,userId,input})

        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException("something went wrong in the server")
            
        }


    }
    
}
