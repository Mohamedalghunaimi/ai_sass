/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email.processor';

@Global()
@Module({
  providers: [EmailService,EmailProcessor],
  exports:[EmailService],
  imports:[
    MailerModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService) => {
        return {
          transport:{
            host:config.get<string>("MAIL_HOST"),
            port:Number(config.get<number>("MAIL_PORT")),
            auth:{
              user:config.get<string>("MAIL_USER"),
              pass:config.get<string>("MAIL_PASS")
            }
          },
          defaults:{
            from: `"my-app" <${config.get<string>("MAIL_FROM")}>`
          }
        }
      }
    }),
    BullModule.registerQueue({
      name: 'email-job',
      defaultJobOptions: {
        attempts: 3, // retries
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
  ]
})
export class EmailModule {}
