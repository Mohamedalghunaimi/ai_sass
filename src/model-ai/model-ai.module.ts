/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { ModelAiService } from './model-ai.service';
@Global()
@Module({
  providers: [ModelAiService],
  exports:[ModelAiService]
})
export class ModelAiModule {}
