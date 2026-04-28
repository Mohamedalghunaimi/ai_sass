/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { AtGuard } from 'src/auth/guards/at-guard/at-guard.guard';
import { GetUserFromAt } from 'src/auth/decorators/get-user-from-at/get-user-from-at.decorator';
import * as type from 'utils/type';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}


  


}
