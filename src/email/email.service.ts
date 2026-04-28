/* eslint-disable prettier/prettier */
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Queue,} from 'bullmq';

@Injectable()
export class EmailService {
    constructor(
        @InjectQueue('email-job') private readonly emailQueue: Queue,

    ) {}


    public async sendToEmail(email:string) {
        try {
            await this.emailQueue.add("send-welcome-email",{email})
        } catch (error) {
            console.error(error) 
            throw new InternalServerErrorException("something went wrong in the server")
        }



    }
    
}
