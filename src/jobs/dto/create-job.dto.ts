/* eslint-disable prettier/prettier */
import { JobType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateJobDto {
    
    @IsEnum(JobType)
    type!:JobType
    
    @IsString()
    @IsNotEmpty()
    input!:string

    
    @IsString()
    @IsNotEmpty()
    chatId!:string

    


}
