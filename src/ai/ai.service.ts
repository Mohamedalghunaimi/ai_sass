/* eslint-disable prettier/prettier */
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class AiService {

    constructor(
        @InjectQueue('video') private readonly aiQueue: Queue
    ) {}

    public async addJob(jobId:string,userId:string,input:string) {

        await this.aiQueue.add('newAiJob',{jobId,userId,input})


    }
    
}
