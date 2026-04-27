/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { tryCatch } from 'bullmq';
import OpenAI from 'openai';

@Injectable()
export class ModelAiService {
    private openai: OpenAI;

    constructor(
        config:ConfigService
    ) {
    this.openai = new OpenAI({
        apiKey: config.get<string>("OPENAI_API_KEY"),
    });
    }
    async generateText(prompt: string)  {
        
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                {
                    role: 'user',
                    content: prompt,
                },
                ],
            });
            return response.choices[0].message.content ;
        } catch (error) {
            console.error(error)
            throw error
            
        }

    }
}
