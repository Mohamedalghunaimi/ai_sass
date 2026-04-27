/* eslint-disable prettier/prettier */
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Queue} from 'bullmq';
import { NewJob } from 'utils/type';

@Injectable()
export class AiService {

    constructor(
        @InjectQueue('ai-job') private readonly aiQueue: Queue,
    ) {}

    public async addJob({chatId,jobId,userId,input}:NewJob) {

        try {

            await this.aiQueue.add('newAiJob',{jobId,userId,input,chatId})

        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException("something went wrong in the server")
            
        }


    }
    
}
