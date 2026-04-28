/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { MailerService } from '@nestjs-modules/mailer';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job,  } from 'bullmq';


@Processor('email-job')
export class EmailProcessor extends WorkerHost  {

    constructor(

        private readonly mail:MailerService

    ) {
        super();
    }

    async process(job: Job<{email:string}>, token?: string): Promise<any> {

        try {
            const {email} = job.data;
            await this.mail.sendMail({
                to:email,
                subject:"welcome message",
                html:`
                <div>
                <h1>welcome to our website </h1>
                <p>
                Hello 👋

Welcome to MyApp 🎉  
We’re really excited to have you with us!

You can now start exploring all our features and services.  
If you need any help, we’re always here for you.

Let’s get started 🚀

Best regards,  
MyApp Team ❤️
                </p>

                </div>
                `
            })
        } catch (error) {
            console.log(error)
            throw error
            
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